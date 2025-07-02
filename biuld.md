starting build "675bf13f-cd6b-4809-8b07-fd87e13d8250"
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
 * branch              12db7a7fde9e840c7103c769d049540d849b3517 -> FETCH_HEAD
Updating files:   2% (723/30450)Updating files:   3% (914/30450)Updating files:   4% (1218/30450)Updating files:   5% (1523/30450)Updating files:   6% (1827/30450)Updating files:   7% (2132/30450)Updating files:   8% (2436/30450)Updating files:   9% (2741/30450)Updating files:  10% (3045/30450)Updating files:  11% (3350/30450)Updating files:  12% (3654/30450)Updating files:  13% (3959/30450)Updating files:  14% (4263/30450)Updating files:  15% (4568/30450)Updating files:  16% (4872/30450)Updating files:  17% (5177/30450)Updating files:  18% (5481/30450)Updating files:  19% (5786/30450)Updating files:  20% (6090/30450)Updating files:  21% (6395/30450)Updating files:  21% (6411/30450)Updating files:  22% (6699/30450)Updating files:  23% (7004/30450)Updating files:  24% (7308/30450)Updating files:  25% (7613/30450)Updating files:  26% (7917/30450)Updating files:  27% (8222/30450)Updating files:  28% (8526/30450)Updating files:  29% (8831/30450)Updating files:  29% (9071/30450)Updating files:  30% (9135/30450)Updating files:  31% (9440/30450)Updating files:  32% (9744/30450)Updating files:  33% (10049/30450)Updating files:  34% (10353/30450)Updating files:  35% (10658/30450)Updating files:  36% (10962/30450)Updating files:  37% (11267/30450)Updating files:  38% (11571/30450)Updating files:  39% (11876/30450)Updating files:  40% (12180/30450)Updating files:  41% (12485/30450)Updating files:  42% (12789/30450)Updating files:  43% (13094/30450)Updating files:  44% (13398/30450)Updating files:  45% (13703/30450)Updating files:  46% (14007/30450)Updating files:  47% (14312/30450)Updating files:  48% (14616/30450)Updating files:  49% (14921/30450)Updating files:  50% (15225/30450)Updating files:  51% (15530/30450)Updating files:  52% (15834/30450)Updating files:  53% (16139/30450)Updating files:  54% (16443/30450)Updating files:  55% (16748/30450)Updating files:  56% (17052/30450)Updating files:  57% (17357/30450)Updating files:  58% (17661/30450)Updating files:  59% (17966/30450)Updating files:  60% (18270/30450)Updating files:  61% (18575/30450)Updating files:  62% (18879/30450)Updating files:  63% (19184/30450)Updating files:  64% (19488/30450)Updating files:  65% (19793/30450)Updating files:  66% (20097/30450)Updating files:  67% (20402/30450)Updating files:  68% (20706/30450)Updating files:  68% (20841/30450)Updating files:  69% (21011/30450)Updating files:  70% (21315/30450)Updating files:  71% (21620/30450)Updating files:  72% (21924/30450)Updating files:  73% (22229/30450)Updating files:  74% (22533/30450)Updating files:  75% (22838/30450)Updating files:  76% (23142/30450)Updating files:  77% (23447/30450)Updating files:  78% (23751/30450)Updating files:  79% (24056/30450)Updating files:  80% (24360/30450)Updating files:  81% (24665/30450)Updating files:  82% (24969/30450)Updating files:  83% (25274/30450)Updating files:  84% (25578/30450)Updating files:  85% (25883/30450)Updating files:  86% (26187/30450)Updating files:  87% (26492/30450)Updating files:  88% (26796/30450)Updating files:  89% (27101/30450)Updating files:  90% (27405/30450)Updating files:  91% (27710/30450)Updating files:  92% (28014/30450)Updating files:  93% (28319/30450)Updating files:  93% (28380/30450)Updating files:  94% (28623/30450)Updating files:  95% (28928/30450)Updating files:  96% (29232/30450)Updating files:  97% (29537/30450)Updating files:  98% (29841/30450)Updating files:  99% (30146/30450)Updating files: 100% (30450/30450)Updating files: 100% (30450/30450), done.
HEAD is now at 12db7a7f Functions
GitCommit:
12db7a7fde9e840c7103c769d049540d849b3517
BUILD
Starting Step #0 - "ubuntu"
Pulling image: ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
Digest: sha256:b59d21599a2b151e23eea5f6602f4af4d7d31c4e236d22bf0b62b86d2e386b8f
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
2025/07/01 23:43:25 FIREBASE_CONFIG has no availability specified, applying the default of 'BUILD' and 'RUNTIME'
2025/07/01 23:43:25 Final app hosting schema:
runConfig:
  cpu: null
  memoryMiB: null
  concurrency: null
  maxInstances: 1
  minInstances: null
  vpcAccess: null
env:
- variable: FIREBASE_CONFIG
  value: '{"databaseURL":"","projectId":"lexai-ef0ab","storageBucket":"lexai-ef0ab.firebasestorage.app"}'
  availability:
  - BUILD
  - RUNTIME
- variable: FIREBASE_WEBAPP_CONFIG
  value: '{"apiKey":"AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI","appId":"1:506027619372:web:00420c7e8002d88c970d89","authDomain":"lexai-ef0ab.firebaseapp.com","databaseURL":"","messagingSenderId":"506027619372","projectId":"lexai-ef0ab","storageBucket":"lexai-ef0ab.firebasestorage.app"}'
  availability:
  - BUILD
2025/07/01 23:43:25 Final app hosting schema:
runConfig:
  cpu: null
  memoryMiB: null
  concurrency: null
  maxInstances: 1
  minInstances: null
  vpcAccess: null
env:
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
e09e94d668b6: Download complete
04f25cfafb1c: Verifying Checksum
04f25cfafb1c: Download complete
3e69fe43643b: Verifying Checksum
3e69fe43643b: Download complete
93a203f379e7: Verifying Checksum
93a203f379e7: Download complete
af99958ebb71: Verifying Checksum
af99958ebb71: Download complete
d1603763b0b1: Download complete
fe0a88c014e5: Verifying Checksum
fe0a88c014e5: Download complete
04f25cfafb1c: Pull complete
4a860ab6726e: Verifying Checksum
4a860ab6726e: Download complete
e09e94d668b6: Pull complete
74f7d76e84e5: Download complete
1a82443b3661: Verifying Checksum
1a82443b3661: Download complete
d9b751bf2041: Verifying Checksum
d9b751bf2041: Download complete
91ae8f86c340: Verifying Checksum
91ae8f86c340: Download complete
74130a0fcd36: Verifying Checksum
74130a0fcd36: Download complete
3e69fe43643b: Pull complete
17ca29ae6eda: Verifying Checksum
17ca29ae6eda: Download complete
85c292bebdfb: Verifying Checksum
85c292bebdfb: Download complete
93a203f379e7: Pull complete
e5bc6e67b0ca: Verifying Checksum
e5bc6e67b0ca: Download complete
b94809254b70: Verifying Checksum
b94809254b70: Download complete
e1cefba2ec7b: Verifying Checksum
e1cefba2ec7b: Download complete
7f6123409057: Verifying Checksum
7f6123409057: Download complete
b5e431259abb: Verifying Checksum
b5e431259abb: Download complete
0075c70421ea: Verifying Checksum
0075c70421ea: Download complete
f11650883630: Verifying Checksum
f11650883630: Download complete
e4cce81d8590: Verifying Checksum
e4cce81d8590: Download complete
af99958ebb71: Pull complete
6eaa83f31821: Verifying Checksum
6eaa83f31821: Download complete
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
659e0dd3258d: Verifying Checksum
659e0dd3258d: Download complete
2f720834fb72: Verifying Checksum
2f720834fb72: Download complete
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
Image with name "us-central1-docker.pkg.dev/lexai-ef0ab/firebaseapphosting-images/lexai:build-2025-07-01-010" not found
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
2025/07/01 23:44:08 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
Adding image label google.runtime-version: nodejs22
2025/07/01 23:44:09 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/version.json
***** CACHE MISS: "nodejs"
Installing Node.js v22.17.0.
2025/07/01 23:44:09 [DEBUG] GET https://dl.google.com/runtimes/ubuntu2204/nodejs/nodejs-22.17.0.tar.gz
=== Node.js - Firebasenextjs (google.nodejs.firebasenextjs@0.0.1) ===
WARNING: *** You are using a custom build command (your build command is NOT 'next build'), we will accept it as is but will error if output structure is not as expected ***
***** CACHE MISS: "npm_modules"
Installing nextjs adaptor 14.0.13
=== Node.js - Npm (google.nodejs.npm@1.1.0) ===
***** CACHE MISS: "npm_modules"
Installing application dependencies.
--------------------------------------------------------------------------------
Running "npm ci --quiet --no-fund --no-audit (NODE_ENV=development)"
added 716 packages in 29s
Done "npm ci --quiet --no-fund --no-audit (NODE_ENV=development)" (28.927412046s)
--------------------------------------------------------------------------------
Running "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build"
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> nextn@0.1.0 build
> next build && npm run analyze
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
 ✓ Compiled successfully in 36.0s
   Linting and checking validity of types ...
./src/ai/orchestrator/clients/anthropic.ts
65:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/base.ts
48:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
50:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/google.ts
79:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
79:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
80:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
100:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/index.ts
17:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/openai.ts
59:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/orchestrator-lazy.ts
10:7  Warning: 'loadUtils' is assigned a value but never used.  @typescript-eslint/no-unused-vars
16:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
17:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
51:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
80:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/pipeline.ts
74:72  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
208:5  Warning: '_lastError' is defined but never used.  @typescript-eslint/no-unused-vars
279:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
279:43  Warning: '_structure' is defined but never used.  @typescript-eslint/no-unused-vars
279:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
292:63  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
313:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
333:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
333:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
343:75  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
379:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
397:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/processors.ts
18:27  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
23:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
58:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
111:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
111:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
180:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
180:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
202:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
250:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
250:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
312:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
367:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
371:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/types.ts
36:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
53:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
99:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
107:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
113:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
118:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
164:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
164:58  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
165:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
166:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
166:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
172:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
173:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
191:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
192:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
248:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
272:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
310:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/app/agente/criar/CriarAgenteClient.tsx
122:12  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
123:15  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
127:16  Warning: Classname 'text-body' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
127:16  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
140:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
142:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
142:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
151:11  Warning: Non-interactive elements should not be assigned mouse or keyboard event listeners.  jsx-a11y/no-noninteractive-element-interactions
./src/app/api/agents/route.ts
48:11  Warning: 'userId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/app/api/generate/route.ts
54:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
./src/app/api/orchestrator/route.ts
48:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
./src/app/generate/components/wizard.tsx
63:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/app/onboarding/page.tsx
370:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
372:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
372:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/onboarding/success/page.tsx
14:12  Warning: Classname 'bg-grid-slate-200/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
14:12  Warning: Classname 'dark:bg-grid-slate-700/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/settings/page.tsx
16:1  Warning: `react` import should occur before import of `@/components/theme-toggle`  import/order
54:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
82:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
115:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
126:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
128:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
128:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/workspace/page.tsx
34:17  Warning: 'userProfile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
35:72  Warning: 'workspaceLoading' is assigned a value but never used.  @typescript-eslint/no-unused-vars
67:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
75:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
75:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
241:33  Warning: Classname 'border-3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
250:35  Warning: Classname 'border-3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
260:35  Warning: Classname 'border-3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/workspace/success/page.tsx
15:12  Warning: Classname 'bg-grid-slate-200/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
15:12  Warning: Classname 'dark:bg-grid-slate-700/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/components/file-upload-enhanced.tsx
31:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
32:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
56:21  Warning: 'processedTexts' is assigned a value but never used.  @typescript-eslint/no-unused-vars
93:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/landing/footer.tsx
3:23  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
./src/components/layout/error-boundary.tsx
128:25  Warning: 'errorInfo' is defined but never used.  @typescript-eslint/no-unused-vars
./src/components/magic-ui/animated-beam.tsx
4:30  Warning: 'ReactElement' is defined but never used.  @typescript-eslint/no-unused-vars
31:7  Warning: 'containerRef' is defined but never used.  @typescript-eslint/no-unused-vars
32:7  Warning: 'fromRef' is defined but never used.  @typescript-eslint/no-unused-vars
33:7  Warning: 'toRef' is defined but never used.  @typescript-eslint/no-unused-vars
34:7  Warning: 'curvature' is assigned a value but never used.  @typescript-eslint/no-unused-vars
35:7  Warning: 'reverse' is assigned a value but never used.  @typescript-eslint/no-unused-vars
38:7  Warning: 'pathColor' is assigned a value but never used.  @typescript-eslint/no-unused-vars
40:7  Warning: 'pathOpacity' is assigned a value but never used.  @typescript-eslint/no-unused-vars
43:7  Warning: 'startXOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
44:7  Warning: 'startYOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
45:7  Warning: 'endXOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
46:7  Warning: 'endYOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/components/ocr/ocr-processor.tsx
30:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/optimization/resource-preloader.tsx
59:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/optimization/web-vitals.tsx
6:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/ui/icons.tsx
169:79  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/ui/page-skeleton.tsx
6:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
6:10  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
44:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
44:10  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
80:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
80:10  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
88:29  Warning: Classnames 'h-8, w-8' could be replaced by the 'size-8' shorthand!  tailwindcss/enforces-shorthand
102:16  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
111:31  Warning: Classnames 'h-12, w-12' could be replaced by the 'size-12' shorthand!  tailwindcss/enforces-shorthand
112:26  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
132:31  Warning: Classnames 'h-8, w-8' could be replaced by the 'size-8' shorthand!  tailwindcss/enforces-shorthand
133:26  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
./src/components/ui/toast.tsx
27:23  Warning: Classname 'destructive' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/contexts/workspace-context.tsx
62:6  Warning: React Hook useEffect has a missing dependency: 'getUserWorkspaces'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
./src/hooks/use-auth.tsx
35:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
156:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
164:58  Warning: 'userData' is defined but never used.  @typescript-eslint/no-unused-vars
164:69  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
176:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
199:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/hooks/use-document-processor.tsx
11:8  Warning: 'DocumentProcessingResult' is defined but never used.  @typescript-eslint/no-unused-vars
./src/hooks/use-focus-management.tsx
3:31  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
./src/hooks/use-ocr.tsx
4:32  Warning: 'recognize' is defined but never used.  @typescript-eslint/no-unused-vars
113:5  Warning: 'enableDeskew' is assigned a value but never used.  @typescript-eslint/no-unused-vars
114:5  Warning: 'enableRotation' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/hooks/use-storage.tsx
90:6  Warning: React Hook useCallback has a missing dependency: 'refreshUserFiles'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
137:6  Warning: React Hook useCallback has a missing dependency: 'refreshUserFiles'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
./src/hooks/use-toast.ts
21:7  Warning: 'actionTypes' is assigned a value but only used as a type.  @typescript-eslint/no-unused-vars
./src/lib/firebase-admin.ts
21:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:75  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
103:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/lib/performance.ts
10:9  Warning: 'criticalClasses' is assigned a value but never used.  @typescript-eslint/no-unused-vars
35:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
35:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/services/document-finalization.ts
4:1  Warning: `./data-cleanup` import should occur before import of `@/lib/firebase`  import/order
4:31  Warning: 'DATA_RETENTION_CONFIG' is defined but never used.  @typescript-eslint/no-unused-vars
211:84  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/services/document-processor.ts
3:1  Warning: `@/lib/firebase` import should occur after import of `./privacy-enforcer`  import/order
4:10  Warning: 'cleanupDocumentData' is defined but never used.  @typescript-eslint/no-unused-vars
./src/services/privacy-enforcer.ts
1:31  Warning: 'DATA_RETENTION_CONFIG' is defined but never used.  @typescript-eslint/no-unused-vars
2:30  Warning: 'ServiceError' is defined but never used.  @typescript-eslint/no-unused-vars
199:94  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
   Collecting page data ...
Error: ❌ Missing required environment variables:
  - NEXT_PUBLIC_FIREBASE_API_KEY
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - NEXT_PUBLIC_FIREBASE_APP_ID
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY
Please ensure all Firebase configuration variables are set in your .env.local file.
See .env.example for the required format.
    at e (.next/server/app/api/agents/route.js:30:59641)
    at 57122 (.next/server/app/api/agents/route.js:34:126)
    at t (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/agents/route.js:34:88465)
    at t.a (.next/server/webpack-runtime.js:1:891)
    at 91002 (.next/server/app/api/agents/route.js:34:88401)
    at t (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/agents/route.js:3:35301)
    at t.a (.next/server/webpack-runtime.js:1:891)
    at 48038 (.next/server/app/api/agents/route.js:3:35122)
> Build error occurred
[Error: Failed to collect page data for /api/agents] { type: 'Error' }
/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:36
                reject(new Error(`Build process exited with error code ${code}.`));
                       ^
Error: Build process exited with error code 1.
    at ChildProcess.<anonymous> (/layers/google.nodejs.firebasenextjs/npm_modules/node_modules/@apphosting/common/dist/index.js:36:24)
    at ChildProcess.emit (node:events:518:28)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
Node.js v22.17.0
Done "npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_m..." (1m21.936799148s)
--------------------------------------------------------------------------------
failed to build: (error ID: 4fc81f30):
{"reason":"Failed Framework Build","code":"fah/failed-framework-build","userFacingMessage":"Your application failed to run the framework build command 'npm exec --prefix /layers/google.nodejs.firebasenextjs/npm_modules apphosting-adapter-nextjs-build' successfully. Please check the raw log to address the error and confirm that your application builds locally before redeploying.","rawLog":"(error ID: d0a693a9):
Overriding Next Config to add configs optmized for Firebase App Hosting
Successfully created next.config.ts with Firebase App Hosting overrides
> nextn@0.1.0 build
> next build && npm run analyze
   ▲ Next.js 15.3.3
   Creating an optimized production build ...
 ✓ Compiled successfully in 36.0s
   Linting and checking validity of types ...
./src/ai/orchestrator/clients/anthropic.ts
65:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/base.ts
48:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
50:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/google.ts
79:37  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
79:45  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
80:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
100:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/index.ts
17:60  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/clients/openai.ts
59:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/orchestrator-lazy.ts
10:7  Warning: 'loadUtils' is assigned a value but never used.  @typescript-eslint/no-unused-vars
16:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
17:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
51:33  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
80:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/pipeline.ts
74:72  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
208:5  Warning: '_lastError' is defined but never used.  @typescript-eslint/no-unused-vars
279:38  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
279:43  Warning: '_structure' is defined but never used.  @typescript-eslint/no-unused-vars
279:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
292:63  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
313:55  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
333:52  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
333:59  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
343:75  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
379:73  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
397:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/processors.ts
18:27  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:67  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
23:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
58:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
111:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
111:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
180:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
180:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
202:42  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
250:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
250:64  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
312:24  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
367:19  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
371:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/ai/orchestrator/types.ts
36:31  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
53:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
99:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
107:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
113:30  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
118:29  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
164:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
164:58  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
165:20  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
166:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
166:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
172:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
173:35  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
191:10  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
192:12  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
248:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
272:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
310:28  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/app/agente/criar/CriarAgenteClient.tsx
122:12  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
123:15  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
127:16  Warning: Classname 'text-body' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
127:16  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
140:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
142:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
142:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
151:11  Warning: Non-interactive elements should not be assigned mouse or keyboard event listeners.  jsx-a11y/no-noninteractive-element-interactions
./src/app/api/agents/route.ts
48:11  Warning: 'userId' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/app/api/generate/route.ts
54:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
./src/app/api/orchestrator/route.ts
48:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
./src/app/generate/components/wizard.tsx
63:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/app/onboarding/page.tsx
370:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
372:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
372:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/onboarding/success/page.tsx
14:12  Warning: Classname 'bg-grid-slate-200/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
14:12  Warning: Classname 'dark:bg-grid-slate-700/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/settings/page.tsx
16:1  Warning: `react` import should occur before import of `@/components/theme-toggle`  import/order
54:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
82:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
115:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
126:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
128:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
128:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/workspace/page.tsx
34:17  Warning: 'userProfile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
35:72  Warning: 'workspaceLoading' is assigned a value but never used.  @typescript-eslint/no-unused-vars
67:43  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
75:12  Warning: Classname 'bg-grid-slate-100/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
75:12  Warning: Classname 'dark:bg-grid-slate-800/50' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
241:33  Warning: Classname 'border-3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
250:35  Warning: Classname 'border-3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
260:35  Warning: Classname 'border-3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/app/workspace/success/page.tsx
15:12  Warning: Classname 'bg-grid-slate-200/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
15:12  Warning: Classname 'dark:bg-grid-slate-700/20' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/components/file-upload-enhanced.tsx
31:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
32:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
56:21  Warning: 'processedTexts' is assigned a value but never used.  @typescript-eslint/no-unused-vars
93:74  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/landing/footer.tsx
3:23  Warning: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
./src/components/layout/error-boundary.tsx
128:25  Warning: 'errorInfo' is defined but never used.  @typescript-eslint/no-unused-vars
./src/components/magic-ui/animated-beam.tsx
4:30  Warning: 'ReactElement' is defined but never used.  @typescript-eslint/no-unused-vars
31:7  Warning: 'containerRef' is defined but never used.  @typescript-eslint/no-unused-vars
32:7  Warning: 'fromRef' is defined but never used.  @typescript-eslint/no-unused-vars
33:7  Warning: 'toRef' is defined but never used.  @typescript-eslint/no-unused-vars
34:7  Warning: 'curvature' is assigned a value but never used.  @typescript-eslint/no-unused-vars
35:7  Warning: 'reverse' is assigned a value but never used.  @typescript-eslint/no-unused-vars
38:7  Warning: 'pathColor' is assigned a value but never used.  @typescript-eslint/no-unused-vars
40:7  Warning: 'pathOpacity' is assigned a value but never used.  @typescript-eslint/no-unused-vars
43:7  Warning: 'startXOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
44:7  Warning: 'startYOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
45:7  Warning: 'endXOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
46:7  Warning: 'endYOffset' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/components/ocr/ocr-processor.tsx
30:49  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/optimization/resource-preloader.tsx
59:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/optimization/web-vitals.tsx
6:34  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
11:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/ui/icons.tsx
169:79  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/components/ui/page-skeleton.tsx
6:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
6:10  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
44:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
44:10  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
80:10  Warning: Classname 'to-primary/3' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
80:10  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
88:29  Warning: Classnames 'h-8, w-8' could be replaced by the 'size-8' shorthand!  tailwindcss/enforces-shorthand
102:16  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
111:31  Warning: Classnames 'h-12, w-12' could be replaced by the 'size-12' shorthand!  tailwindcss/enforces-shorthand
112:26  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
132:31  Warning: Classnames 'h-8, w-8' could be replaced by the 'size-8' shorthand!  tailwindcss/enforces-shorthand
133:26  Warning: Invalid Tailwind CSS classnames order  tailwindcss/classnames-order
./src/components/ui/toast.tsx
27:23  Warning: Classname 'destructive' is not a Tailwind CSS class!  tailwindcss/no-custom-classname
./src/contexts/workspace-context.tsx
62:6  Warning: React Hook useEffect has a missing dependency: 'getUserWorkspaces'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
./src/hooks/use-auth.tsx
35:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
156:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
164:58  Warning: 'userData' is defined but never used.  @typescript-eslint/no-unused-vars
164:69  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
176:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
199:21  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/hooks/use-document-processor.tsx
11:8  Warning: 'DocumentProcessingResult' is defined but never used.  @typescript-eslint/no-unused-vars
./src/hooks/use-focus-management.tsx
3:31  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
./src/hooks/use-ocr.tsx
4:32  Warning: 'recognize' is defined but never used.  @typescript-eslint/no-unused-vars
113:5  Warning: 'enableDeskew' is assigned a value but never used.  @typescript-eslint/no-unused-vars
114:5  Warning: 'enableRotation' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/hooks/use-storage.tsx
90:6  Warning: React Hook useCallback has a missing dependency: 'refreshUserFiles'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
137:6  Warning: React Hook useCallback has a missing dependency: 'refreshUserFiles'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
./src/hooks/use-toast.ts
21:7  Warning: 'actionTypes' is assigned a value but only used as a type.  @typescript-eslint/no-unused-vars
./src/lib/firebase-admin.ts
21:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:75  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
103:25  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/lib/performance.ts
10:9  Warning: 'criticalClasses' is assigned a value but never used.  @typescript-eslint/no-unused-vars
35:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
35:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:56  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/services/document-finalization.ts
4:1  Warning: `./data-cleanup` import should occur before import of `@/lib/firebase`  import/order
4:31  Warning: 'DATA_RETENTION_CONFIG' is defined but never used.  @typescript-eslint/no-unused-vars
211:84  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
./src/services/document-processor.ts
3:1  Warning: `@/lib/firebase` import should occur after import of `./privacy-enforcer`  import/order
4:10  Warning: 'cleanupDocumentData' is defined but never used.  @typescript-eslint/no-unused-vars
./src/services/privacy-enforcer.ts
1:31  Warning: 'DATA_RETENTION_CONFIG' is defined but never used.  @typescript-eslint/no-unused-vars
2:30  Warning: 'ServiceError' is defined but never used.  @typescript-eslint/no-unused-vars
199:94  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
   Collecting page data ...
Error: ❌ Missing required environment variables:
  - NEXT_PUBLIC_FIREBASE_API_KEY
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - NEXT_PUBLIC_FIREBASE_APP_ID
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY
Please ensure all Firebase configuration variables are set in your .env.local file.
See .env.example for the required format.
    at e (.next/server/app/api/agents/route.js:30:59641)
    at 57122 (.next/server/app/api/agents/route.js:34:126)
    at t (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/agents/route.js:34:88465)
    at t.a (.next/server/webpack-runtime.js:1:891)
    at 91002 (.next/server/app/api/agents/route.js:34:88401)
    at t (.next/server/webpack-runtime.js:1:128)
    at <unknown> (.next/server/app/api/agents/route.js:3:35301)
    at t.a (.next/server/webpack-runtime.js:1:891)
    at 48038 (.next/server/app/api/agents/route.js:3:35122)
> Build error occurred
[Error: Failed to collect page data for /api/agents] { type: 'Error' }
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