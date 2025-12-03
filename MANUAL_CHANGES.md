# EXACT CODE TO ADD - COPY AND PASTE

## FILE 1: src/pages/Indexing.js

### STEP 1: Add this import at line 2 (after `import React from 'react';`)

```javascript
import { LogoLoop } from '../components/Logoloop';
```

### STEP 2: Find line 69 which has `))}`  and `</div>` and `</section>`
Replace those 3 lines with this:

```javascript
              ))}
            </div>
            
            {/* Animated Logo Loop */}
            <div className="mt-12 bg-slate-100 py-8 rounded-2xl">
              <LogoLoop
                logos={currentIndexing.map(item => ({
                  node: <div className="h-10 flex items-center text-slate-700 text-lg font-semibold whitespace-nowrap px-6">{item.name}</div>
                }))}
                speed={50}
                direction="left"
                logoHeight={40}
                gap={48}
                fadeOut={true}
                pauseOnHover={true}
              />
            </div>
          </section>
```

---

## FILE 2: src/pages/Landing.js (OPTIONAL - for StarBorder animation on cards)

### Add this import at the top (after other imports):

```javascript
import StarBorder from '../components/StarBorder';
```

### Then find any card (like the ones in "Call for Papers" section around line 313) and wrap it:

**BEFORE:**
```javascript
<div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
  <h3 className="text-lg font-semibold text-slate-900 mb-3">Scope Highlights</h3>
  ...content...
</div>
```

**AFTER:**
```javascript
<StarBorder as="div" color="rgb(251, 191, 36)" speed="4s">
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <h3 className="text-lg font-semibold text-slate-900 mb-3">Scope Highlights</h3>
    ...content...
  </div>
</StarBorder>
```

---

## SUMMARY OF WHAT'S DONE:

✅ tailwind.config.js - StarBorder animations added (DONE)
✅ Landing.js - Duplicate About section removed (DONE by you)
✅ Landing.js - Images vertical stack (DONE)

## WHAT YOU NEED TO DO:

1. **Indexing.js** - Add LogoLoop (2 simple copy-pastes above)
2. **Landing.js** - Add StarBorder to cards (optional, example above)

That's it! Just these 2 simple changes.
