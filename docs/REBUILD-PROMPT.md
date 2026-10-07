# ShawtyPop website: full rebuild prompt

Snapshot of shawtypop.com as of October 6, 2026.

**How to use this:** paste everything under "The prompt" into Claude. Attach the five images and `index-backup.html`, which are saved in the project files under `website/rebuild`.

- **Fastest recovery:** if the backup HTML is available, Claude should restore that file exactly. That is a perfect copy of the site. The written spec below is the fallback for rebuilding from scratch.
- **The code also lives on GitHub:** the live site is the `main` branch of github.com/ShawtyPop/shawtypop. Git history keeps every past version, so check there first.

---

## The prompt

Rebuild the ShawtyPop website (shawtypop.com) exactly as described here.

If I attached `index-backup.html`, put it at `public/index.html` unchanged and skip the rest of this spec. Use the spec only to check that the backup is complete.

### 1. Brand and content rules (never break these)

- **Brand:** ShawtyPop, a caffeinated lollipop (caffeine + L-Theanine) sold as a fashion piece.
- **Socials:** Instagram and TikTok handle @getshawtypop.
  - Instagram: https://www.instagram.com/getshawtypop/
  - TikTok: https://www.tiktok.com/@getshawtypop
- **The flavor:** there is only one flavor, **Cherry Gloss**.
  - Always write "Cherry Gloss", never just "Cherry".
  - Never hint at other flavors.
- **No lip gloss comparison:** never compare the product to lip gloss.
- **Products and prices:**
  - Cherry Gloss Single $2.99
  - Cherry Gloss 5 Pack $9.99 (badge "Best Seller")
  - Cherry Gloss 12 Pack $19.99 (badge "Best Value")
- **Slogans:**
  - Main: "Pop Culture"
  - Tagline: "No jitters. No bloat. No crash. Just pop."
  - Sub-slogans: "Energy, accessorized", "No boring energy", "Fashion you can taste", "Wear your energy"
- **Banned phrases:** never use "Small pop, big energy", "Shop the Shawtys" or "Candy for the hot ones".
- **Newsletter:** the newsletter is called **Pop Culture** ("Join the Pop Culture"). Perks are 15% off your first order, first dibs on every Cherry Gloss drop, and first in the know. There is no monthly subscription and no customer accounts for now (Carter plans a subscription later, once the product exists).
- **Images:** never use drawn or cartoon lollipops anywhere. Every lollipop image is the real product photo.
- **Emoji:** no 🍭 emoji anywhere.
- **Things that were removed on purpose (do not add back):**
  - Search
  - an Our Story section
  - "Pink, black, white. Repeat."
  - "New Shawtys just dropped"
  - the "Added / View" toast pill after adding to cart
  - colored swatch dots
  - any 3D or three.js lollipop
  - zoom-toward-camera effects
  - bow graphics
  - bouquet or bundle pack renders

### 2. Tech and hosting

- **One file:** a single static file, `public/index.html`, with all CSS and JS inline.
- **Images:** inline as base64 data URIs, so the site is one file.
- **Hosting:** a Cloudflare Worker named `shawtypop` serving static assets. It deploys automatically from the `main` branch of GitHub repo ShawtyPop/shawtypop. `wrangler.jsonc` is:
  ```
  { "name": "shawtypop", "compatibility_date": "2026-10-01",
    "assets": { "directory": "./public", "not_found_handling": "single-page-application" } }
  ```
- **Routing:** single-page routing.
  - `/` shows the **brand home page** with the spinning lollipop (Carter switched it back on Oct 7, 2026).
  - `/shop` shows the **product page**. Old `/home` and `/pop-culture` links show the home page.
  - A script in `<head>` adds class `v-shop` to `<html>` when the path matches `/shop`.
  - With `v-shop`, only the product section and the marquee show. Without it, the product section is hidden and the brand sections show.
- **Fonts:** from Google Fonts.
  - Archivo (variable width 62–125 and weight 400–900): the main display and body font.
  - Instrument Serif (italic): accents.
- **Page title:** "ShawtyPop | Fashion, Accessorized".
- **Meta description:** "ShawtyPop. Glossy lollipops with big flavor and zero boring energy."
- **Theme color:** #EA3C8C.

### 3. Images (attach these)

- `lollipop-photo-on-pink.jpg` (1000x1500): the real Cherry Gloss lollipop standing upright on a pink background. Main product photo.
- `lollipop-cutout.webp` (523x1443, transparent): the same lollipop cut out. The candy circle sits at the top (center about x 261, y 261, radius 259) and the rose-gold stick runs down the middle (x 223–306). Used for every other lollipop image.
- `logo-one-line-header.webp`: the one-line "shawtypop™" wordmark (pink "shawty", plum "pop" with lips for the o). Used in the header, the mobile menu and the password gate.
- `logo-transparent-footer.webp`: the transparent wordmark for the footer brand column (46px tall).
- `favicon-lips.png`: the pink lips icon. Used as the favicon and apple-touch-icon.

### 4. Design tokens

- **Colors:**
  - pink #EA3C8C
  - hot pink #FF1D8D
  - deep pink #C41F6C
  - pink ink #7A0C3F
  - blush #FFF0F7
  - cream #F8E1E2
  - blush-2 #FFD9EB
  - black, white
  - text gray rgba(0,0,0,.6)
  - lines rgba(0,0,0,.12)
- **Display style (class `d`):** Archivo 900, width 112, letter-spacing -.045em, line-height .84, uppercase.
- **Labels:** 11px, weight 700, letter-spacing .18em, uppercase.
- **Buttons:**
  - Pill shape, 58px tall, 12px uppercase text, weight 800, letter-spacing .16em.
  - Black by default, with a pink fill sliding up from the bottom on hover and a scale of 1.035.
  - The pink variant fills black on hover.
  - The small variant is 46px tall.
- **Easing:** cubic-bezier(.16,1,.3,1).
- **Page gutter:** clamp(16px, 3.2vw, 48px).
- **Reveal on scroll:** elements fade up 36px when they enter the viewport.

### 5. Shared elements (on every page)

- **Announcement bar:** black, 36px, white uppercase 11px text. It rotates every 4.2s between two messages:
  - "● Free shipping on orders $50+"
  - "Join the Pop Culture for 15% off ●"
  - The dot is pink.
- **Header:**
  - Sticky, cream background, 76px tall, shrinking to 62px with a soft shadow once scrolled.
  - Left: "Shop" (links to /shop) and "Home" (links to /).
  - Center: the one-line logo, 36px tall, linking to /.
  - Right: "Cart" with a pink count bubble.
  - Under 1024px wide: a burger icon on the left, the centered logo, and a bag icon with count on the right.
- **Mobile menu:**
  - Full screen, cream, opening with a circular clip reveal from the top-left.
  - Big display links "Shop", "Home" (pink) and "Pop Culture" (links to /#club).
  - Footer row with "@getshawtypop" (Instagram).
- **Marquee:**
  - Black band scrolling left on a loop over 34s.
  - Items alternate between big uppercase white text and pink italic serif text, separated by small round pink "pip" dots: "Cherry Gloss", *no boring energy*, "Fashion you can taste", *pop off*, "Wear your energy", *energy, accessorized.*
  - It shows on both pages.
- **Footer (black):**
  - Brand column:
    - the transparent logo (46px tall)
    - pink italic serif line "Fashion, accessorized."
    - an underlined email field "Email for drops" with a pink "Join" button. On submit it signs the email up (see "Email signups") and the placeholder changes to "You're on the list 💗".
  - Link columns:
    - Shop: Shop All, Best Sellers, New Drops, Collections, all linking to /shop
    - About: Contact, FAQ
    - Help: Shipping, Returns, Privacy, Terms
    - Social: Instagram, TikTok, plus round outlined icon buttons for both, turning pink on hover
  - Giant "SHAWTYPOP" text runs across the bottom as a pink outline with no fill (transparent text with a clamp(1.5px,.18vw,3px) pink stroke): Archivo 900, width 125, letter-spacing -.065em, uppercase, auto-sized by script to fill the footer width exactly, sitting slightly cut off at the bottom edge. It is text, not the logo image.
  - Bottom bar: "© 2026 ShawtyPop. Prototype storefront."
- **Cart drawer:**
  - Slides in from the right, 460px wide, over a dark scrim. Title "Your bag" in display type with a pink superscript count.
  - A blush free-shipping bar reads "You're $X away from free shipping" and fills toward $50. At $50 it reads "You unlocked free shipping 💗".
  - Each line item has:
    - the real lollipop cutout on a blush tile (88x108px, rotated -12°, 96px tall)
    - name, flavor and price
    - a quantity stepper
    - the line total
    - "Remove"
  - Empty state: the lollipop cutout, "Your bag is empty.", "No shawtys yet. Let's fix that." and a "Shop Cherry Gloss" button.
  - "Add a little extra" row: pills for products not yet in the bag, each with a tiny real lollipop image, name and price.
  - Subtotal, "Taxes and shipping calculated at checkout.", and a pink "Checkout →" button. Checkout is not connected yet.
  - The cart is saved in localStorage key `shawtypop_cart_v1`.
  - On phones, a floating black "Bag (n) · $x" bar with a "View bag" button appears when the bag has items.
- **Newsletter popup:**
  - Appears 3 seconds after the site is visible: 3 seconds after load for unlocked visitors, or 3 seconds after the password gate is unlocked. It shows on every visit, except that closing it hides it for the rest of that browser session (sessionStorage key `sp_nl`) and signing up through it hides it for good (localStorage key `sp_nl_joined`).
  - Content:
    - white rounded card on a blurred dark overlay
    - pink kicker "Join the Pop Culture"
    - big "15% OFF" with the pink italic serif line "your first order" under it
    - text: "Sign up for Pop Culture, the ShawtyPop newsletter, and get 15% off, plus first dibs on every Cherry Gloss drop."
    - email field, pink "Get 15% off" button, "No thanks" link and a close X
  - Success shows "You're in 💗".
  - The email is signed up as described in "Email signups".
- **Password gate:**
  - Full-screen hot-pink "Join the waitlist" overlay shown to visitors until they enter the prototype password **ShawtyPop123**.
  - Unlocking sets localStorage `shawtypop_gate_v1` to "open". This is a prototype gate only, since the password is visible in the page source.
  - Content:
    - the logo on a soft white glow
    - heading "Join the *waitlist*"
    - text "Shawtypop is almost here. Get on the list for the first drop."
    - First name and Email fields with a white "Join →" button. On submit it signs the email and name up (see "Email signups") and shows "You're on the list, {name}".
    - a "Have a password?" toggle with a password field and "Enter →"
- **Email signups:**
  - The popup, the footer field and the waitlist gate all send the email to MailerLite with a background POST (`mode: "no-cors"`) to `https://assets.mailerlite.com/jsonp/2690429/forms/200599344405021977/subscribe`, with form fields `fields[email]` (plus `fields[name]` from the gate), `ml-submit=1` and `anticsrf=true`. That is the MailerLite embedded form "Website Signup", which adds people to the Newsletter group. The MailerLite account signs in with Google as getshawtypop@gmail.com.
  - Each signup also goes to the "ShawtyPop Subscribers" Google Sheet as a backup, through a Google Apps Script web app (`SHEET_URL` in the code, with fields `email` and `source` set to Popup, Footer or Waitlist). The script is saved in the project files at `website/subscribers-apps-script.gs`.
  - While a signup is sending, the message reads "Adding you…". If it fails, it reads "Something went wrong, try again".
- **Hidden on purpose:** the add-to-cart toast exists in the code but is hidden with `display:none`.

### 6. Product page (`/shop`)

- **Layout:**
  - Two columns on desktop (gallery on the left, about 1.15 to 1).
  - Stacked on screens under 860px wide.
- **Gallery:**
  - A sticky main image with 4:5 shape and 22px rounded corners. It shows `lollipop-photo-on-pink.jpg`, cropped from the top.
  - A column of two thumbnails on the left (they move under the image on mobile):
    - Thumbnail 1: the photo.
    - Thumbnail 2: the cutout rotated -14° on a hot-pink radial background with a drop shadow.
  - Clicking a thumbnail swaps the main image. The active thumbnail gets a black outline.
- **Info column, top to bottom:**
  1. Pink label "Caffeine + L-Theanine lollipop".
  2. Huge display title "CHERRY / GLOSS" on two lines.
  3. Italic serif line "Fashion you can taste."
  4. Price in large bold type, with the per-pop price next to it in gray. Single shows "1 pop", the 5 Pack shows "$2.00 / pop", and the 12 Pack shows "$1.67 / pop".
  5. Gray line "No jitters. No bloat. No crash. Just pop."
  6. "Choose your pack": three selectable cards side by side, with the 5 Pack selected by default. All three are options of the one Cherry Gloss product on this one page. A link like `/shop?pack=cherry-gloss-12` opens the page with that pack already picked.
     - Single / "1 pop" / $2.99
     - 5 Pack / "Best Seller" / $9.99
     - 12 Pack / "Best Value" / $19.99
     - Cards are blush with a thin border. The selected one turns white with a 2px black border.
  7. A quantity stepper (pill) and a pink "Add to bag · $price" button showing the pack price times the quantity. Adding puts that pack in the cart and resets the quantity to 1.
  8. A black rounded banner (opens the newsletter popup): pink label "Pop Culture", "Join our newsletter for 15% off your first order.", and "→".
  9. Blush pill chips: "No jitters", "No crash", "Free shipping on $50+".
  10. Accordion:
      - "The pop" (open by default): "One glossy Cherry Gloss lollipop on a rose gold ShawtyPop stick, made with caffeine and L-Theanine. Energy, accessorized."
      - "Shipping": "Free shipping on orders over $50."

### 7. Brand home page (`/`, the default page)

Sections in order:

1. **Opener: "Join the Pop Culture" scroll scene**
   - Section height 150svh with a sticky 100svh stage. The stage is a hot-pink radial gradient (#FF4FA0 to #FF1D8D to #E2066F) with a soft white bloom and faint rotating white rays.
   - Text:
     - "POP" huge in solid white display type, with "Join the" in small white italic serif to its left.
     - "CULTURE" below it as a white outline that fills in solid white as you scroll.
     - The text never moves. It scales up only slightly.
   - The lollipop cutout floats gently up and down, centered in front of the text. Its scroll motion:
     - At the top of the page it is turned to -112° (head dipped below horizontal) at 58% scale.
     - As you scroll it does one smooth half turn to +112°, growing to full size with a cosine ease.
     - No overshoot, no stopping, no zoom toward the camera, and no 3D.
     - Progress runs over the 50svh pin plus 35% of the viewport, so the page never feels stuck waiting on the animation.
   - Lollipop shading (so it doesn't look like a paper cutout):
     - A shading layer, masked by the cutout's own shape, adds a darker rim around the candy, a soft gloss highlight near its top-left, and a light-to-dark band across the stick so it reads as round.
     - A drop shadow on the unrotated parent always falls straight down.
   - About 26 small pastel sparkle dots burst outward as you scroll. A "Scroll" cue with a pulsing line fades out.
   - The turn starts on the very first pixel of page scroll (progress = scrollY / total, not measured from when the section reaches the top under the header), so there is no dead scroll before it moves.
   - A white pill button "Shop now →" (class `pop__shop`) sits centered right under the lollipop, above the Scroll cue, and links to `/shop`. Its bottom offset is `calc(var(--header-h) + 36px + clamp(20px,4vh,44px))` so it shows at scroll 0 on desktop and phone.
   - Reduced-motion users see the final state with no motion.
2. **Marquee:** as above.
3. **Product shelf:**
   - Three product cards in a row, centered on wide screens and horizontally scrollable on smaller ones.
   - The section heading is hidden.
   - Each card:
     - Blush 4:5 tile with the real lollipop cutout, 40% wide and slightly rotated.
     - A big black display "ghost" label in the bottom-left: "SINGLE", "5 PACK" or "12 PACK".
     - A black badge for Best Seller or Best Value.
   - On hover:
     - A soft feathered hot-pink burst spreads out from the center (an animated radial mask, not a hard circle).
     - The lollipop tilts up.
     - A black "Shop now →" pill slides up.
   - Below each card: the name on one line (for example "CHERRY GLOSS 5 PACK"), the price, and "Cherry Gloss · 5 pops".
   - On phones there is a full-width "Shop now · $price" button instead of the hover pill.
   - Clicking a card (or its button) does not add to the bag. It opens the product page at `/shop?pack=<that pack>` so the product page is where people buy.
4. **Pop Culture newsletter (`#club`), black section:**
   - Heading "JOIN THE" in white and "POP CULTURE." in pink.
   - Pink label "The newsletter" with the text "Pop Culture is the ShawtyPop newsletter. Sign up for 15% off your first order, plus first dibs on every Cherry Gloss drop."
   - Pink button "Join the Pop Culture →" that opens the newsletter popup.
   - Numbered perk list with pink italic serif numbers and pink "+" icons:
     - 01 15% off: "Your first order, as soon as you sign up."
     - 02 First dibs: "Get every Cherry Gloss restock before it sells out."
     - 03 First in the know: "Hear about launches, events and news before anyone else."
   - A small rotated real lollipop peeks in from the bottom.
5. **Feature, pink section:**
   - Giant drifting display words: "WEAR YOUR" in black and "ENERGY." in white, aligned right.
   - The words slide sideways in opposite directions as you scroll, and the lollipop cutout (rotated -14°, deep-pink drop shadow) floats and tilts with the scroll.
   - Top left: an outlined "Featured" chip and "The one everyone posts".
   - Bottom left, italic serif: "Matches every outfit. Especially the pink ones."
   - White product card on the right:
     - "Best seller" with pink ★★★★★
     - "CHERRY GLOSS 5 PACK" at $9.99
     - Spec grid: Flavor Cherry Gloss, Size 5 pops / pack, Finish High gloss, Vibe Main character
     - Quantity stepper and an "Add to cart" button that adds the 5 Pack

### 8. Behavior details

- **Cart actions:** every add-to-cart bumps the cart count with a little wiggle animation.
- **Placeholder messages:** the Checkout button is a placeholder. Its message appears in the hidden toast, so nothing visible happens.
- **Escape key:** closes the cart, the menu and the popup.
- **Responsive:** test at 1366px desktop and 390px phone widths. There should be no horizontal scrolling, and long words like "CULTURE" must fit on phones (16vw).
- **Accessibility:** keyboard focus rings are pink, and the newsletter popup has dialog semantics.

### 9. Deploy

1. Commit to the `carter` branch.
2. Push the same commit to `main`.
3. Confirm that the "Workers Builds: shawtypop" check on GitHub passes. If one build fails on Cloudflare's side while `npx wrangler deploy --dry-run` succeeds locally, push the next real change and it will usually pass.
