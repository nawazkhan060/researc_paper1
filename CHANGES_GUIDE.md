# EXACT CODE CHANGES GUIDE

## ✅ COMPLETED:
1. **tailwind.config.js** - StarBorder animations added

## 📝 MANUAL CHANGES NEEDED:

### Change 1: Remove Duplicate About Section
**File:** `src/pages/Landing.js`
**Action:** Delete lines 516-622 (the entire second "About IJEPA" section)

**How to do it:**
1. Open `src/pages/Landing.js`
2. Go to line 516 (search for the second occurrence of `{/* About IJEPA - two-column layout */}`)
3. Select from line 516 to line 622 (ends with `</section>`)
4. Delete the selected lines

---

### Change 2: Images One Below Another
**File:** `src/pages/Landing.js`
**Lines:** 189-204

**FIND THIS (around line 189):**
```javascript
              <div className="relative grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden col-span-2 lg:col-span-1">
                  <img
                    src={hero}
                    alt="Researchers collaborating on publications"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl bg-white shadow-lg border border-slate-200 overflow-hidden mt-6 lg:mt-12">
                  <img
                    src={hero}
                    alt="Editorial and review process illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
```

**REPLACE WITH:**
```javascript
              <div className="relative flex flex-col gap-4">
                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                  <img
                    src={hero}
                    alt="Researchers collaborating on publications"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl bg-white shadow-lg border border-slate-200 overflow-hidden">
                  <img
                    src={hero}
                    alt="Editorial and review process illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
```

**Changes made:**
- Line 189: Changed `grid grid-cols-2` to `flex flex-col`
- Line 190: Removed `col-span-2 lg:col-span-1`
- Line 197: Removed `mt-6 lg:mt-12`

---

### Change 3: Add LogoLoop to Indexing Page
**File:** `src/pages/Indexing.js`

**Step 1 - Add import at the top (after line 1):**
```javascript
import { LogoLoop } from '../components/Logoloop';
```

**Step 2 - Find this code (around lines 493-499):**
```javascript
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-4">
                <div className="h-10 flex items-center text-slate-500 text-lg font-semibold">Google Scholar</div>
                <div className="h-10 flex items-center text-slate-500 text-lg font-semibold">ROAD</div>
                <div className="h-10 flex items-center text-slate-500 text-lg font-semibold">ISSUU</div>
                <div className="h-10 flex items-center text-slate-500 text-lg font-semibold">Slideshare</div>
                <div className="h-10 flex items-center text-slate-500 text-lg font-semibold">CiteSeerX</div>
              </div>
```

**Replace with:**
```javascript
              <LogoLoop
                logos={[
                  { node: <div className="h-10 flex items-center text-slate-500 text-lg font-semibold whitespace-nowrap">Google Scholar</div> },
                  { node: <div className="h-10 flex items-center text-slate-500 text-lg font-semibold whitespace-nowrap">ROAD</div> },
                  { node: <div className="h-10 flex items-center text-slate-500 text-lg font-semibold whitespace-nowrap">ISSUU</div> },
                  { node: <div className="h-10 flex items-center text-slate-500 text-lg font-semibold whitespace-nowrap">Slideshare</div> },
                  { node: <div className="h-10 flex items-center text-slate-500 text-lg font-semibold whitespace-nowrap">CiteSeerX</div> },
                ]}
                speed={50}
                direction="left"
                logoHeight={40}
                gap={48}
                fadeOut={true}
                pauseOnHover={true}
              />
```

---

### Change 4: NPM Dependencies
**Run this command:**
```bash
npm install three @react-three/fiber@^8.15.0 @react-three/drei@^9.88.0
```

**Why this version?**
- Your project uses React 18.3.1
- Latest `@react-three/fiber` requires React 19
- Version 8.15.0 is compatible with React 18

---

### Change 5: Add StarBorder to Cards (Example)
**File:** Any file with cards (e.g., `src/pages/Landing.js`)

**Step 1 - Add import:**
```javascript
import StarBorder from '../components/StarBorder';
```

**Step 2 - Wrap any card with StarBorder:**

**BEFORE:**
```javascript
<div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
  {/* Card content */}
</div>
```

**AFTER:**
```javascript
<StarBorder as="div" color="rgb(251, 191, 36)" speed="4s">
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    {/* Card content */}
  </div>
</StarBorder>
```

---

## 🎯 SUMMARY OF CHANGES:

1. ✅ **tailwind.config.js** - StarBorder animations (DONE)
2. ⏳ **Landing.js line 516-622** - Remove duplicate About section
3. ⏳ **Landing.js line 189** - Change images to vertical stack
4. ⏳ **Indexing.js** - Add LogoLoop animation
5. ⏳ **NPM** - Install React Three dependencies
6. ⏳ **Cards** - Wrap with StarBorder (optional, do after testing)

## 🚀 RECOMMENDED ORDER:

1. Install NPM dependencies first
2. Remove duplicate About section
3. Change images layout
4. Add LogoLoop to Indexing page
5. Test everything
6. Add StarBorder to cards if desired
