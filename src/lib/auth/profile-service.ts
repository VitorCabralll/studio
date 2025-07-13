/**
 * Simplified Profile Service - Essential CRUD operations only
 * Replaces complex profile-manager.ts with simple, focused functionality
 */

import { doc, getDoc, setDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { UserProfile, CacheEntry, CacheMetrics } from './types';
import { IProfileManager } from './interfaces';

// ===== SIMPLE TTL CACHE =====

class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private metrics: CacheMetrics = { hits: 0, misses: 0, size: 0 };
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: T, ttl = this.defaultTTL): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
    this.metrics.size = this.cache.size;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.misses++;
      return undefined;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      this.metrics.misses++;
      this.metrics.size = this.cache.size;
      return undefined;
    }

    this.metrics.hits++;
    return entry.value;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.metrics.size = this.cache.size;
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.metrics = { hits: 0, misses: 0, size: 0 };
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }
}

// ===== PROFILE SERVICE =====

export class ProfileService implements IProfileManager {
  private static instance: ProfileService | null = null;
  private cache = new SimpleCache<UserProfile>();
  private readonly collectionName = 'profiles';

  constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  // ===== CORE CRUD OPERATIONS =====

  async getProfile(uid: string): Promise<UserProfile | null> {
    // Check cache first
    const cached = this.cache.get(uid);
    if (cached) {
      return cached;
    }

    try {
      const db = getFirebaseDb();
      const profileRef = doc(db, this.collectionName, uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        return null;
      }

      const profile = profileSnap.data() as UserProfile;
      
      // Cache the result
      this.cache.set(uid, profile);
      
      return profile;

    } catch (error) {
      console.error('Failed to get profile:', error);
      throw new Error(`Profile retrieval failed: ${error}`);
    }
  }

  async createUserProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const now = Date.now();
      const profileData: UserProfile = {
        uid,
        email: data.email || '',
        name: data.name,
        displayName: data.displayName,
        phone: data.phone,
        company: data.company,
        oab: data.oab,
        acceptNewsletter: data.acceptNewsletter || false,
        cargo: data.cargo || '',
        areas_atuacao: data.areas_atuacao || [],
        primeiro_acesso: data.primeiro_acesso ?? true,
        initial_setup_complete: data.initial_setup_complete ?? false,
        createdAt: now,
        updatedAt: now
      };

      const db = getFirebaseDb();
      const profileRef = doc(db, this.collectionName, uid);

      // Use transaction to prevent overwrites
      await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(profileRef);
        
        if (existing.exists()) {
          throw new Error('Profile already exists');
        }
        
        transaction.set(profileRef, profileData);
      });

      // Cache the new profile
      this.cache.set(uid, profileData);
      
      return profileData;

    } catch (error) {
      console.error('Failed to create profile:', error);
      throw new Error(`Profile creation failed: ${error}`);
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const db = getFirebaseDb();
      const profileRef = doc(db, this.collectionName, uid);

      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };

      await updateDoc(profileRef, updateData);

      // Get updated profile
      const updatedProfile = await this.getProfile(uid);
      
      if (!updatedProfile) {
        throw new Error('Profile not found after update');
      }

      // Update cache
      this.cache.set(uid, updatedProfile);
      
      return updatedProfile;

    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error(`Profile update failed: ${error}`);
    }
  }

  async profileExists(uid: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(uid);
      return profile !== null;
    } catch (error) {
      console.error('Failed to check profile existence:', error);
      return false;
    }
  }

  // ===== INTERFACE IMPLEMENTATION =====

  async loadProfile(uid: string): Promise<UserProfile | null> {
    return this.getProfile(uid);
  }

  async createProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
    return await this.createUserProfile(uid, data);
  }

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    return await this.updateUserProfile(uid, updates);
  }

  async deleteProfile(uid: string): Promise<void> {
    try {
      const db = getFirebaseDb();
      const profileRef = doc(db, this.collectionName, uid);
      await setDoc(profileRef, { deleted: true, deletedAt: Date.now() }, { merge: true });
      this.cache.delete(uid);
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw new Error(`Profile deletion failed: ${error}`);
    }
  }

  cacheProfile(uid: string, profile: UserProfile): void {
    this.cache.set(uid, profile);
  }

  getCachedProfile(uid: string): UserProfile | null {
    return this.cache.get(uid) || null;
  }

  async preloadProfiles(uids: string[]): Promise<void> {
    // Optional implementation for batch preloading
    try {
      await Promise.all(uids.map(uid => this.getProfile(uid)));
    } catch (error) {
      console.warn('Profile preloading failed:', error);
    }
  }

  // ===== CACHE MANAGEMENT =====

  getCacheMetrics(): CacheMetrics {
    return this.cache.getMetrics();
  }

  clearCache(): void {
    this.cache.clear();
  }

  // ===== CLEANUP =====

  destroy(): void {
    this.clearCache();
    ProfileService.instance = null;
  }
}

// ===== EXPORTS =====

// Singleton instance
export const profileService = ProfileService.getInstance();

// Convenience functions
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return profileService.getProfile(uid);
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
  return profileService.createUserProfile(uid, data);
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  return profileService.updateUserProfile(uid, updates);
}