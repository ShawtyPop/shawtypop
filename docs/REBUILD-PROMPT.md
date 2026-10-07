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
- **Page title:** "ShawtyPop" (no tagline, Carter).
- **Meta description:** "ShawtyPop. Glossy lollipops with big flavor and zero boring energy."
- **Theme color:** #EA3C8C.

### 3. Images (attach these)

- `lollipop-photo-on-pink.jpg` (1000x1500): the real Cherry Gloss lollipop (thin rose-gold stick printed "shawtypop™") standing upright on a pink background, unwrapped. Main product photo.
- `lollipop-wrapped-on-pink.jpg` (1000x1500): the same lollipop in its clear cellophane wrapper printed with pink "shawtypop" and lips, on pink. Second product photo.
- `card-wrapped.webp` and `card-unwrapped.webp` (660x1419, transparent): the wrapped and unwrapped lollipop cut out and framed identically (same canvas, stick in the same place) so one can swap for the other. Used only by the home product cards.
- `lollipop-cutout.webp` (493x1349, transparent): the unwrapped lollipop cut out. The candy circle sits at the top (center about x 246, y 245, radius 246) and the thin rose-gold stick runs down the middle (x 220–273). Used for every other lollipop image.
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
  - Items alternate between big uppercase white text and pink italic serif text, separated by small round pink "pip" dots: "Caffeine + L-Theanine", *energy + focus*, "Cherry Gloss", *no boring energy*, "Fashion you can taste", *pop off*, "Wear your energy", *energy, accessorized.*
  - It shows on both pages.
- **Footer (white):** white background, black text, gray column headings, black-outline social circles, light gray divider above the copyright bar.
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
- **Password gate (waitlist screen):**
  - Full-screen overlay shown to visitors until they enter the prototype password **ShawtyPop123**. Unlocking sets localStorage `shawtypop_gate_v1` to "open". This is a prototype gate only, since the password is visible in the page source.
  - Styled like Carter's "Want a sucker?" flyer: blush #FFE3EF background with a #F9C6DA dot grid (26px), plum #5F2850 and hot pink #F8217B, Fraunces 900 (SOFT 100, WONK 1) headline.
  - Two columns on desktop:
    - Left: the one-line logo; headline "Join the" (plum) / "waitlist." (hot pink); text "ShawtyPop is almost here. Get on the list for first dibs on Cherry Gloss."; a white card with a 3px plum border, 26px corners and a solid 7px plum drop (like the flyer's QR box) holding First name and Email fields (blush pills) and a hot-pink "Join →" button. On submit it signs the email and name up (see "Email signups") and shows "You're on the list, {name}".
    - Under the card: "JOIN THE POP SQUAD" with Instagram and TikTok pill buttons (white, plum border, plum drop; hover hot pink) linking to @getshawtypop, plus an italic pink "@getshawtypop".
    - Then a pink "HAVE A PASSWORD?" toggle with a password field and "Enter →".
    - Right: a big pink #F8C3D7 disc with the real lollipop cutout tilted -22°, gently floating.
    - Subtle copy on the disc behind the lollipop: a ring of small spaced caps "CAFFEINE + L-THEANINE ·" (Archivo 800, #E58DB2) slowly spinning (60s), and big tone-on-tone Fraunces 900 words "Energy / + Focus" (#F2AFCB) in the middle.
    - Pink lips (transparent) bottom-right. (No "Coming soon" label, Carter removed it.)
  - Phones: ONE FIXED SCREEN, no scrolling (100dvh, overflow hidden, content centered). Disc and lollipop on top at 30dvh, then logo, "Join the waitlist." on ONE line (min(13.4vw,7dvh), nowrap), the short text, the card (first name; email + Join on one row), Instagram/TikTok pills, and "Have a password?". No lips on phones. Opening the password toggle hides the text and socials to make room.
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
    - Thumbnail 1: the unwrapped photo.
    - Thumbnail 2: the wrapped photo.
    - Thumbnail 3: the cutout rotated -14° on a hot-pink radial background with a drop shadow.
  - Clicking a thumbnail swaps the main image. The active thumbnail gets a black outline.
- **Info column, top to bottom:**
  1. Pink label "Caffeine + L-Theanine lollipop".
  2. Huge display title "CHERRY / GLOSS" on two lines.
  3. Italic serif line "Fashion you can taste."
  3b. Two pill chips: black "CAFFEINE + L-THEANINE" and hot-pink "ENERGY + FOCUS".
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
   - Section height 125svh with a sticky stage pinned at top 62px and `calc(100svh - 112px)` tall (`calc(100svh - 96px)` on phones), i.e. exactly the space under the announcement bar and header, so "Pop Culture" and the lollipop start centered on screen. The stage is a hot-pink radial gradient (#FF4FA0 to #FF1D8D to #E2066F) with a soft white bloom and faint rotating white rays.
   - Text:
     - "POP" huge in solid white display type, with "Join the" in small white italic serif to its left.
     - "CULTURE" below it as a white outline that fills in solid white as you scroll.
     - The text never moves. It scales up only slightly.
   - The lollipop cutout floats gently up and down, centered in front of the text. Its scroll motion:
     - At the top of the page it is turned to -112° (head dipped below horizontal) at 58% scale.
     - As you scroll it does one smooth half turn to +112°, growing to full size with a cosine ease.
     - No overshoot, no stopping, no zoom toward the camera, and no 3D.
     - Progress runs over the 25svh pin plus 35% of the viewport, so the page never feels stuck waiting on the animation.
   - Lollipop shading (so it doesn't look like a paper cutout):
     - A shading layer, masked by the cutout's own shape, adds a darker rim around the candy, a soft gloss highlight near its top-left, and a light-to-dark band across the stick so it reads as round.
     - The shadow is its own layer (`.pop__shadow`): a plum shape masked by the lollipop image, blurred 14px, given the same rotate/scale as the lollipop plus a straight-down offset. Never put a CSS filter (drop-shadow) on the floating parent: it repaints every frame and made the turn laggy on phones.
   - Size: the lollipop art is `min(86svh,760px)` tall on desktop and `min(60svh,110vw)` on phones so the finished, nearly flat turn stays about screen-wide.
   - Performance (phones): every moving piece (lollipop, shadow, bloom, rays, type, sparks) is its own GPU layer (`will-change`) and the script writes only `transform`/`opacity` straight onto each element per frame (no CSS variables on the whole section). "CULTURE" fills in by fading a solid white copy on top (`.pop__fillw`, opacity), not by changing the text color. Measured on a 4x-throttled phone: 60fps instead of ~30fps.
   - About 26 small pastel sparkle dots burst outward as you scroll. A "Scroll" cue with a pulsing line fades out.
   - The turn starts on the very first pixel of page scroll (progress = scrollY / total, not measured from when the section reaches the top under the header), so there is no dead scroll before it moves.
   - A white pill button "Shop now →" (class `pop__shop`) sits centered right under the lollipop, above the Scroll cue, and links to `/shop`. Its bottom offset is `calc(clamp(18px,3.4vh,40px) + 66px)` so it shows at scroll 0 on desktop and phone.
   - Reduced-motion users see the final state with no motion.
2. **Marquee:** as above.
3. **The formula section (`.duo`, blush, centered):** pink label "THE FORMULA"; huge display "CAFFEINE + L‑THEANINE" (hot-pink +, non-breaking hyphen so L‑Theanine never splits); pink italic serif "= Energy + Focus." (= and + in black); two white cards: "CAFFEINE / the energy / The lift you came for, in a Cherry Gloss pop." and "L-THEANINE / the focus / Paired with the caffeine to keep it smooth and locked in. No jitters, no crash." Carter wants Caffeine + L-Theanine and Energy + Focus pushed as the main selling point.
3b. **Product shelf (one big card):**
   - ONE big Cherry Gloss card, centered (flex-basis clamp(440px,46vw,680px) on desktop, full width on phones). Single, 5 Pack and 12 Pack are not separate cards; they are options on the product page. The section heading and progress bar are hidden.
   - The card:
     - Blush 4:5 tile with the lollipop IN ITS WRAPPER (`card-wrapped.webp`, clear film with the pink backdrop removed), 46% wide, rotated -10°. The unwrapped cutout (`card-unwrapped.webp`) sits underneath, nudged translate(.6%,2.4%) so its candy lines up with the wrapped candy.
     - A big black display ghost label in the bottom-left: "CHERRY / GLOSS" on two lines.
   - On hover (no pink burst, the tile stays blush):
     - The wrapper TEARS OFF, fast and physical (WebGL, one `<canvas class="card__melt">` 2x wide and 1.3x tall around the pop so the pieces can swing out). Total 0.62s; moving off re-wraps in 0.32s. The film texture is the wrapper with the candy removed (clear film + print + sheen), drawn over the real unwrapped pop so the candy never tears.
       - 0–0.1: the film tugs tight.
       - 0.06–0.24: a jagged rip shoots from the top edge to the twist, with a thin stress-whitened edge and the candy showing through the gap. A few stretched strands bridge it, then snap.
       - 0.24–0.86: the two halves peel down and out around the twist (each rotates up to 1.9 rad about the twist, slides out 9% and down, shrinks to 0.86 in perspective), with crumpled torn edges and a flash of shine as they turn.
       - 0.72–0.95: the halves fade off; a glint at the twist and one shine sweep across the bare candy finish it.
     - Phones (no hover): the tear plays once when the card is 85% in view. Reduced motion or no WebGL: the old CSS two-halves tear is the fallback (`.card.gl` hides it when WebGL runs).
     - The lollipop tilts up and a black "Shop now →" pill slides up.
   - Below the card: "CHERRY GLOSS", "From $2.99", and "Single · 5 Pack · 12 Pack".
   - On phones there is a full-width "Shop now · from $2.99" button instead of the hover pill.
   - Clicking the card opens `/shop` (no pack forced).
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
