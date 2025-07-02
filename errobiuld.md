starting build "899acb51-5930-4c25-bddc-759690f4d7ab"
FETCHSOURCE
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint:
hint: 	git config --global init.defaultBranch <name>
hint:
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint:
hint: 	git branch -m <name>
Initialized empty Git repository in /workspace/.git/
From https://github.com/VitorCabralll/studio
 * branch            36829dfcbe80385f5caa612fadd3c5c666147ae1 -> FETCH_HEAD
HEAD is now at 36829df bugs e mais bugs
GitCommit:
36829dfcbe80385f5caa612fadd3c5c666147ae1
BUILD
Starting Step #0 - "ubuntu"
Pulling image: ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
b08e2ff4391e: Pulling fs layer
b08e2ff4391e: Verifying Checksum
b08e2ff4391e: Download complete
b08e2ff4391e: Pull complete
Digest: sha256:89ef6e43e57cb94a23e4b28715a34444de91f45bd410fce3ce00819f86940a9c
Status: Downloaded newer image for ubuntu:latest
docker.io/library/ubuntu:latest
Finished Step #0 - "ubuntu"
Starting Step #1 - "preparer"
Pulling image: us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250509_18_04_RC00
base_20250509_18_04_RC00: Pulling from serverless-runtimes/utilities/preparer
d30f5c571232: Pulling fs layer
d30f5c571232: Verifying Checksum
d30f5c571232: Download complete
d30f5c571232: Pull complete
Digest: sha256:df208748ab63c6b91b3adcaa1dbe255b12b522d2fa21421d2432700be6f19a68
Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250509_18_04_RC00
us-central1-docker.pkg.dev/serverless-runtimes/utilities/preparer:base_20250509_18_04_RC00
2025/07/02 05:57:25 FIREBASE_PROJECT_ID has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 FIREBASE_CLIENT_EMAIL has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 FIREBASE_PRIVATE_KEY has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 OPENAI_API_KEY has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 GOOGLE_AI_API_KEY has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 ANTHROPIC_API_KEY has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 NODE_ENV has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 NEXT_PUBLIC_APP_ENV has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 NEXT_PUBLIC_DEMO_MODE has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 FIREBASE_CONFIG has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/02 05:57:25 Pinned secret projects/lexai-ef0ab/secrets/firebase-client-email/versions/latest to projects/506027619372/secrets/firebase-client-email/versions/2 for the rest of the current build and run
2025/07/02 05:57:25 Pinned secret projects/lexai-ef0ab/secrets/firebase-private-key/versions/latest to projects/506027619372/secrets/firebase-private-key/versions/1 for the rest of the current build and run
2025/07/02 05:57:25 Pinned secret projects/lexai-ef0ab/secrets/openai-api-key/versions/latest to projects/506027619372/secrets/openai-api-key/versions/1 for the rest of the current build and run
2025/07/02 05:57:25 Pinned secret projects/lexai-ef0ab/secrets/google-ai-api-key/versions/latest to projects/506027619372/secrets/google-ai-api-key/versions/1 for the rest of the current build and run
2025/07/02 05:57:25 Pinned secret projects/lexai-ef0ab/secrets/anthropic-api-key/versions/latest to projects/506027619372/secrets/anthropic-api-key/versions/1 for the rest of the current build and run
2025/07/02 05:57:25 Accessed secret projects/506027619372/secrets/firebase-client-email/versions/2 for the rest of the current build
2025/07/02 05:57:25 Accessed secret projects/506027619372/secrets/firebase-private-key/versions/1 for the rest of the current build
2025/07/02 05:57:25 Accessed secret projects/506027619372/secrets/openai-api-key/versions/1 for the rest of the current build
2025/07/02 05:57:25 Accessed secret projects/506027619372/secrets/google-ai-api-key/versions/1 for the rest of the current build
2025/07/02 05:57:25 Accessed secret projects/506027619372/secrets/anthropic-api-key/versions/1 for the rest of the current build
2025/07/02 05:57:25 Final app hosting schema:
runConfig:
  cpu: 1
  memoryMiB: 512
  concurrency: 1000
  maxInstances: 3
  minInstances: 1
  vpcAccess: null
env:
- variable: FIREBASE_PROJECT_ID
  value: lexai-ef0ab
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_CLIENT_EMAIL
  secret: projects/506027619372/secrets/firebase-client-email/versions/2
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_PRIVATE_KEY
  secret: projects/506027619372/secrets/firebase-private-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: OPENAI_API_KEY
  secret: projects/506027619372/secrets/openai-api-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: GOOGLE_AI_API_KEY
  secret: projects/506027619372/secrets/google-ai-api-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: ANTHROPIC_API_KEY
  secret: projects/506027619372/secrets/anthropic-api-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: NODE_ENV
  value: production
  availability:
  - BUILD
  - RUNTIME
- variable: NEXT_PUBLIC_APP_ENV
  value: production
  availability:
  - BUILD
  - RUNTIME
- variable: NEXT_PUBLIC_DEMO_MODE
  value: "false"
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_CONFIG
  value: '{"databaseURL":"","projectId":"lexai-ef0ab","storageBucket":"lexai-ef0ab.firebasestorage.app"}'
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_WEBAPP_CONFIG
  value: '{"apiKey":"AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI","appId":"1:506027619372:web:00420c7e8002d88c970d89","authDomain":"lexai-ef0ab.firebaseapp.com","databaseURL":"","messagingSenderId":"506027619372","projectId":"lexai-ef0ab","storageBucket":"lexai-ef0ab.firebasestorage.app"}'
  availability:
  - BUILD
2025/07/02 05:57:25 Final app hosting schema:
runConfig:
  cpu: 1
  memoryMiB: 512
  concurrency: 1000
  maxInstances: 3
  minInstances: 1
  vpcAccess: null
env:
- variable: FIREBASE_PROJECT_ID
  value: lexai-ef0ab
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_CLIENT_EMAIL
  secret: projects/506027619372/secrets/firebase-client-email/versions/2
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_PRIVATE_KEY
  secret: projects/506027619372/secrets/firebase-private-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: OPENAI_API_KEY
  secret: projects/506027619372/secrets/openai-api-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: GOOGLE_AI_API_KEY
  secret: projects/506027619372/secrets/google-ai-api-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: ANTHROPIC_API_KEY
  secret: projects/506027619372/secrets/anthropic-api-key/versions/1
  availability:
  - BUILD
  - RUNTIME
- variable: NODE_ENV
  value: production
  availability:
  - BUILD
  - RUNTIME
- variable: NEXT_PUBLIC_APP_ENV
  value: production
  availability:
  - BUILD
  - RUNTIME
- variable: NEXT_PUBLIC_DEMO_MODE
  value: "false"
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_CONFIG
  value: '{"databaseURL":"","projectId":"lexai-ef0ab","storageBucket":"lexai-ef0ab.firebasestorage.app"}'
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_WEBAPP_CONFIG
  value: '{"apiKey":"AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI","appId":"1:506027619372:web:00420c7e8002d88c970d89","authDomain":"lexai-ef0ab.firebaseapp.com","databaseURL":"","messagingSenderId":"506027619372","projectId":"lexai-ef0ab","storageBucket":"lexai-ef0ab.firebasestorage.app"}'
  availability:
  - BUILD
Finished Step #1 - "preparer"
Starting Step #2 - "pack"
Pulling image: gcr.io/k8s-skaffold/pack
Using default tag: latest
latest: Pulling from k8s-skaffold/pack
396c31837116: Pulling fs layer
9776b10d5c8c: Pulling fs layer
52cb9ac3197f: Pulling fs layer
9776b10d5c8c: Verifying Checksum
9776b10d5c8c: Download complete
396c31837116: Verifying Checksum
396c31837116: Download complete
52cb9ac3197f: Verifying Checksum
52cb9ac3197f: Download complete
396c31837116: Pull complete
9776b10d5c8c: Pull complete
52cb9ac3197f: Pull complete
Digest: sha256:221c0c0d9a90f46f108bb888a1da9e99c82ff631e8b1c63b0223ea951752bd53
Status: Downloaded newer image for gcr.io/k8s-skaffold/pack:latest
gcr.io/k8s-skaffold/pack:latest
nodejs_20250623_RC00: Pulling from serverless-runtimes/google-22-full/builder/nodejs
e1a89dea01a6: Already exists
1a11d4d06153: Already exists
240d71b590fc: Already exists
04f25cfafb1c: Pulling fs layer
e09e94d668b6: Pulling fs layer
3e69fe43643b: Pulling fs layer
93a203f379e7: Pulling fs layer
af99958ebb71: Pulling fs layer
d1603763b0b1: Pulling fs layer
fe0a88c014e5: Pulling fs layer
1a82443b3661: Pulling fs layer
4a860ab6726e: Pulling fs layer
74f7d76e84e5: Pulling fs layer
d9b751bf2041: Pulling fs layer
91ae8f86c340: Pulling fs layer
74130a0fcd36: Pulling fs layer
17ca29ae6eda: Pulling fs layer
85c292bebdfb: Pulling fs layer
e5bc6e67b0ca: Pulling fs layer
b94809254b70: Pulling fs layer
7f6123409057: Pulling fs layer
e1cefba2ec7b: Pulling fs layer
b5e431259abb: Pulling fs layer
f11650883630: Pulling fs layer
0075c70421ea: Pulling fs layer
e4cce81d8590: Pulling fs layer
6eaa83f31821: Pulling fs layer
34ce8ba30961: Pulling fs layer
e6178d2c0976: Pulling fs layer
4f4fb700ef54: Pulling fs layer
93a203f379e7: Waiting
af99958ebb71: Waiting
d1603763b0b1: Waiting
fe0a88c014e5: Waiting
1a82443b3661: Waiting
4a860ab6726e: Waiting
74f7d76e84e5: Waiting
d9b751bf2041: Waiting
91ae8f86c340: Waiting
74130a0fcd36: Waiting
17ca29ae6eda: Waiting
85c292bebdfb: Waiting
e5bc6e67b0ca: Waiting
b94809254b70: Waiting
7f6123409057: Waiting
e1cefba2ec7b: Waiting
b5e431259abb: Waiting
f11650883630: Waiting
0075c70421ea: Waiting
e4cce81d8590: Waiting
6eaa83f31821: Waiting
34ce8ba30961: Waiting
e6178d2c0976: Waiting
4f4fb700ef54: Waiting
04f25cfafb1c: Verifying Checksum
04f25cfafb1c: Download complete
e09e94d668b6: Download complete
3e69fe43643b: Verifying Checksum
3e69fe43643b: Download complete
93a203f379e7: Verifying Checksum
93a203f379e7: Download complete
af99958ebb71: Verifying Checksum
af99958ebb71: Download complete
04f25cfafb1c: Pull complete
d1603763b0b1: Verifying Checksum
d1603763b0b1: Download complete
fe0a88c014e5: Verifying Checksum
fe0a88c014e5: Download complete
e09e94d668b6: Pull complete
74f7d76e84e5: Verifying Checksum
74f7d76e84e5: Download complete
4a860ab6726e: Verifying Checksum
4a860ab6726e: Download complete
1a82443b3661: Verifying Checksum
1a82443b3661: Download complete
3e69fe43643b: Pull complete
d9b751bf2041: Verifying Checksum
d9b751bf2041: Download complete
91ae8f86c340: Verifying Checksum
91ae8f86c340: Download complete
74130a0fcd36: Verifying Checksum
74130a0fcd36: Download complete
93a203f379e7: Pull complete
17ca29ae6eda: Verifying Checksum
17ca29ae6eda: Download complete
85c292bebdfb: Verifying Checksum
85c292bebdfb: Download complete
e5bc6e67b0ca: Verifying Checksum
e5bc6e67b0ca: Download complete
b94809254b70: Verifying Checksum
b94809254b70: Download complete
7f6123409057: Verifying Checksum
7f6123409057: Download complete
e1cefba2ec7b: Verifying Checksum
e1cefba2ec7b: Download complete
b5e431259abb: Verifying Checksum
b5e431259abb: Download complete
f11650883630: Verifying Checksum
f11650883630: Download complete
af99958ebb71: Pull complete
6eaa83f31821: Verifying Checksum
6eaa83f31821: Download complete
0075c70421ea: Verifying Checksum
0075c70421ea: Download complete
e4cce81d8590: Verifying Checksum
e4cce81d8590: Download complete
34ce8ba30961: Verifying Checksum
34ce8ba30961: Download complete
e6178d2c0976: Verifying Checksum
e6178d2c0976: Download complete
4f4fb700ef54: Verifying Checksum
4f4fb700ef54: Download complete
d1603763b0b1: Pull complete
fe0a88c014e5: Pull complete
1a82443b3661: Pull complete
4a860ab6726e: Pull complete
74f7d76e84e5: Pull complete
d9b751bf2041: Pull complete
91ae8f86c340: Pull complete
74130a0fcd36: Pull complete
17ca29ae6eda: Pull complete
85c292bebdfb: Pull complete
e5bc6e67b0ca: Pull complete
b94809254b70: Pull complete
7f6123409057: Pull complete
e1cefba2ec7b: Pull complete
b5e431259abb: Pull complete
f11650883630: Pull complete
0075c70421ea: Pull complete
e4cce81d8590: Pull complete
6eaa83f31821: Pull complete
34ce8ba30961: Pull complete
e6178d2c0976: Pull complete
4f4fb700ef54: Pull complete
Digest: sha256:9c2c2f38cce0c6ee041206e09dededac1644ac2fe4355f673ba25e41241f1bc0
Status: Downloaded newer image for us-central1-docker.pkg.dev/serverless-runtimes/google-22-full/builder/nodejs:nodejs_20250623_RC00
latest: Pulling from gae-runtimes/buildpacks/stacks/google-gae-22/run
f557aa5ee224: Already exists
fcc20857c828: Pulling fs layer
f84532fe811c: Pulling fs layer
80360511c45e: Pulling fs layer
71454a932260: Pulling fs layer
7eae2c09e7ac: Pulling fs layer
2f720834fb72: Pulling fs layer
659e0dd3258d: Pulling fs layer
71454a932260: Waiting
7eae2c09e7ac: Waiting
2f720834fb72: Waiting
659e0dd3258d: Waiting
fcc20857c828: Verifying Checksum
fcc20857c828: Download complete
80360511c45e: Verifying Checksum
80360511c45e: Download complete
fcc20857c828: Pull complete
71454a932260: Verifying Checksum
71454a932260: Download complete
7eae2c09e7ac: Verifying Checksum
7eae2c09e7ac: Download complete
2f720834fb72: Download complete
659e0dd3258d: Verifying Checksum
659e0dd3258d: Download complete
f84532fe811c: Verifying Checksum
f84532fe811c: Download complete
f84532fe811c: Pull complete
80360511c45e: Pull complete
71454a932260: Pull complete
7eae2c09e7ac: Pull complete
2f720834fb72: Pull complete
659e0dd3258d: Pull complete
Digest: sha256:f9ac1f664d992b796cd5b5baf2798e31f109c10f6abd7ebc2b06d5b4cf044d4a
Status: Downloaded newer image for gcr.io/gae-runtimes/buildpacks/stacks/google-gae-22/run:latest
===> ANALYZING
Image with name "us-central1-docker.pkg.dev/lexai-ef0ab/firebaseapphosting-images/lexai:build-2025-07-02-001" not found
===> DETECTING
target distro name/version labels not found, reading /etc/os-release file
4 of 5 buildpacks participating
google.nodejs.runtime        1.0.0
google.nodejs.firebasenextjs 0.0.1
google.nodejs.npm            1.1.0
google.nodejs.firebasebundle 0.0.1
===> RESTORING
===> BUILDING
target distro name/version labels not found, reading /etc/os-release file
=== Node.js - Runtime (google.nodejs.runtime@1.0.0) ===
2025/07/02 05:57:59 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Adding image label google.runtime-version: nodejs22
2025/07/02 05:57:59 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
***** CACHE MISS: "nodejs"
Installing Node.js v22.17.0.
2025/07/02 05:57:59 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-22.17.0.tar.gz
=== Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
***** CACHE MISS: "npm_modules"
Installing nextjs adaptor 14.0.13
=== Node.js - Npm (google.nodejs.npm@1.1.0) ===
***** CACHE MISS: "npm_modules"
Installing application dependencies.
--------------------------------------------------------------------------------
Running "npm ci --quiet --no-fund --no-audit (NODE_ENV=production)"
added 433 packages in 28s
Done "npm ci --quiet --no-fund --no-audit (NODE_ENV=production)" (27.699998297s)
--------------------------------------------------------------------------------
Running "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build"
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> lexai@0.1.0 build
> next build
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
Failed to compile.
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/button'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/card'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/input'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/label'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/select'
https://nextjs.org/docs/messages/module-not-found
> Build failed because of webpack errors
/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:36
                reject(new Error(`Build process exited with error code ${code}.`));
                       ^
Error: Build process exited with error code 1.
    at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:36:24)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v22.17.0
Done "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_m..." (15.312911073s)
--------------------------------------------------------------------------------
failed to build: (error ID: f76b52ac):
{"reason":"Failed Framework Build","code":"fah/failed-framework-build","userFacingMessage":"Your application failed to run the framework build command 'npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build' successfully. Please check the raw log to address the error and confirm that your application builds locally before redeploying.","rawLog":"(error ID: d0a693a9):
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> lexai@0.1.0 build
> next build
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
Failed to compile.
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/button'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/card'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/input'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/label'
https://nextjs.org/docs/messages/module-not-found
./src/app/agente/criar/CriarAgenteClient.tsx
Module not found: Can't resolve '@/components/ui/select'
https://nextjs.org/docs/messages/module-not-found
> Build failed because of webpack errors
/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:36
                reject(new Error(`Build process exited with error code ${code}.`));
                       ^
Error: Build process exited with error code 1.
    at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:36:24)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v22.17.0"}
ERROR: failed to build: exit status 1
ERROR: failed to build: executing lifecycle: failed with status code: 51
Finished Step #2 - "pack"
ERROR
ERROR: build step 2 "gcr.io/k8s-skaffold/pack" failed: step exited with non-zero status: 1