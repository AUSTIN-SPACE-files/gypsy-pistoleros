# Bandzoogle CSS Class Names to Target

Open gypsypistoleros.com in Chrome, right-click each element, Inspect.
Record the actual class names here before writing any override CSS.

## To inspect:
- [ ] Site title / band name element: class = ?
- [ ] Main navigation container: class = ?
- [ ] Navigation links: class = ?
- [ ] Page header/hero container: class = ?
- [ ] Header image element: class = ?
- [ ] H1 headings: class = ?
- [ ] H2 headings: class = ?
- [ ] Body text / paragraphs: class = ?
- [ ] Primary CTA buttons: class = ?
- [ ] "Add to cart" button: class = ?
- [ ] Product grid container: class = ?
- [ ] Product item card: class = ?
- [ ] Mailing list signup form: class = ?
- [ ] Footer container: class = ?
- [ ] Social icons bar: class = ?
- [ ] Page content wrapper: class = ?
- [ ] Mobile nav toggle: class = ?

## Web Awesome 3.7.0 + Font Awesome Pro — Bandzoogle deployment

These five tags must be added to **both** the trial account and live site:
Pages → Site-wide Settings → Headers & Metatags

```html
<link rel="stylesheet" href="https://ka-f.webawesome.com/webawesome@3.7.0/styles/themes/default.css" />
<link rel="stylesheet" href="https://ka-f.webawesome.com/webawesome@3.7.0/styles/native.css" />
<link rel="stylesheet" href="https://ka-f.webawesome.com/webawesome@3.7.0/styles/utilities.css" />
<script type="module" src="https://ka-f.webawesome.com/webawesome@3.7.0/webawesome.loader.js"></script>
<!-- Font Awesome Pro Kit — unlocks Graphite, Duotone, Sharp, all Pro families -->
<script src="https://kit.fontawesome.com/6a400036f2.js" crossorigin="anonymous"></script>
```

- [ ] Added to trial account Headers & Metatags
- [ ] Added to live site (gypsypistoleros.com) Headers & Metatags

Note: `<script type="module">` **is** supported in Bandzoogle's Headers & Metatags field.
The WA autoloader only downloads component code for elements actually used on the page — no bloat.
The FA Pro kit must load **after** the WA loader — this order is required for Graphite icons to resolve correctly.

## Notes:
Bandzoogle uses the 'remix' stylesheet (confirmed from page source).
The stylesheet is loaded from:
//assets-app-production-pubnet.bndzgl.com/assets/remix-[hash].css
This cannot be edited — we override on top of it.

## Tips for inspecting:
1. Open gypsypistoleros.com in Chrome
2. Right-click any element → Inspect
3. In the Elements panel, look at the class attribute
4. Also check the Styles panel — note which rules come from the remix stylesheet
5. Specificity: our overrides need to be at least as specific as BZ's own rules
   (add extra selectors like `body .classname` if needed)

## Specificity strategy:
Bandzoogle loads its CSS before ours in the Customize CSS field, so same-specificity
rules in our CSS will win. But if BZ uses !important or inline styles, we'll need
to match or escalate.
