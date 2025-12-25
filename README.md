# Museo Balizet - Your Personal Museum

## 🎨 What You've Got

A beautiful, elegant museum-themed learning platform built just for you! Features:
- **Royal blue color scheme** (#383d97) matching your gift card
- **5 museums** with curated content
- **3 art movement topics** (Impressionism, Post-Impressionism, Surrealism)
- **73 images** across all content
- **Progress tracking** that saves automatically
- **Request system** for new lessons

## 🚀 Quick Start

### Testing Locally
1. Put all files in the same folder
2. Create an `images` subfolder
3. Add all your image files to the `images` folder
4. Double-click `index.html` to open in browser

### Deploy to GitHub Pages (FREE Hosting!)

**Step 1: Create Repository**
1. Go to github.com and sign in
2. Click "+" → "New repository"
3. Name it: `museo-balizet` (or whatever you like)
4. Make it **Public**
5. Don't initialize with README
6. Click "Create repository"

**Step 2: Upload Files**
1. Click "uploading an existing file"
2. Drag these files:
   - index.html
   - style.css
   - app.js
   - content.json
   - README.md
3. Click "Commit changes"

**Step 3: Upload Images**
1. Click "Add file" → "Upload files"
2. Type `images/` in the name field to create the folder
3. Drag all 73 image files
4. Click "Commit changes"

**Step 4: Enable GitHub Pages**
1. Go to Settings → Pages
2. Source: Select "main" branch
3. Click Save
4. Wait 2-3 minutes
5. Your site will be live at: `https://YOUR-USERNAME.github.io/museo-balizet/`

## 📁 File Structure

```
museo-balizet/
├── index.html          # Main page structure
├── style.css           # Royal blue styling
├── app.js              # Interactive functionality
├── content.json        # YOUR museum data (edit this!)
├── README.md           # This file
└── images/             # All artwork images (73 files)
    ├── pissarro_camille-autoportrait_1873.jpg
    ├── las-meninas.jpg
    ├── henri-matisse-asia.png
    └── ... (70 more images)
```

## ✏️ How to Add Content

### Editing content.json

This is the ONLY file you'll edit regularly. It contains all your museums, lessons, and images.

**To add a new lesson:**

1. Open `content.json` in GitHub (click pencil icon to edit)
2. Find the museum you want to add to
3. In the `lessons` array, add:

```json
{
  "id": "unique-lesson-id",
  "title": "Lesson Title",
  "type": "youtube",
  "description": "What this covers",
  "url": "https://youtu.be/VIDEO_ID"
}
```

**Lesson types:**
- `"youtube"` - Embedded video
- `"external"` - Link to Udemy/Coursera (opens new tab)
- `"custom"` - Multi-page lesson with images

**For external courses (Udemy):**
```json
{
  "id": "impressionism-course",
  "title": "Complete Impressionism Course",
  "type": "external",
  "description": "Deep dive into the movement",
  "url": "https://www.udemy.com/course/impressionism/",
  "note": "Ask me for the login credentials!"
}
```

The app will automatically show login info when clicked.

**For custom multi-page lessons:**
```json
{
  "id": "velazquez-lesson",
  "title": "Understanding Velázquez",
  "type": "custom",
  "author": "By Bernard",
  "content": [
    {
      "type": "text",
      "text": "Page 1 content here..."
    },
    {
      "type": "image",
      "url": "images/las-meninas.jpg",
      "caption": "Las Meninas, 1656"
    },
    {
      "type": "youtube",
      "url": "https://youtu.be/VIDEO_ID",
      "description": "Watch this analysis"
    }
  ]
}
```

### Adding Images

1. Upload image to GitHub's `images` folder
2. Reference it in content.json as: `"url": "images/filename.jpg"`
3. Supported formats: JPG, PNG, GIF, WebP

## 🎨 Color Scheme

The site uses a royal blue theme:
- **Royal Blue:** #383d97 (main brand color)
- **Deep Navy:** #2a2e5f (darker accents)
- **Gold:** #D4AF37 (highlights)
- **White/Gray:** #FFFFFF / #F5F5F5 (backgrounds)

To change colors, edit the CSS variables at the top of `style.css`.

## 📧 Request Form

When your mom submits a request, it opens her email with:
- **To:** bernardaudbalizet@gmail.com
- **Subject:** Museo Balizet - Lesson Request
- **Body:** Her request details

## 🔄 How to Update Content

### From GitHub Web Interface:
1. Click on `content.json`
2. Click pencil icon (Edit)
3. Make changes
4. Scroll down, click "Commit changes"
5. Wait 1-2 minutes for site to update

### From Multiple Computers:
1. **Always download the latest version first** before editing
2. Edit locally
3. Upload (replace old file)
4. Changes live in 1-2 minutes

## 📊 Progress Tracking

The app automatically tracks:
- Completed lessons
- Museums visited
- Recent activity

All saved in the browser (localStorage). If browser data is cleared, progress resets.

## 🆘 Troubleshooting

**Nothing shows up:**
- Check that `content.json` is in the main folder (not in a subfolder)
- Open browser console (F12) to see errors
- Verify JSON syntax is valid (no missing commas or brackets)

**Images don't load:**
- Verify images are in the `images` folder
- Check that filenames in `content.json` match exactly (case-sensitive!)
- Make sure paths start with `images/` (not `/images/`)

**Videos don't play:**
- YouTube URLs work in any format (youtu.be or youtube.com/watch)
- Check that the URL is correct

## 📈 What's Included

### Museums (5):
1. **Denver Art Museum** - 5 exhibitions, 11 images, Pissarro custom lesson
2. **Museo del Prado** - 7 exhibitions, 5 images, Velázquez, Caravaggio, more
3. **Kimbell Art Museum** - Matisse, Monet, Fauvism, architecture
4. **Museo de las Américas** - 5 exhibitions, 8 images, Taíno culture, Santos de Palo
5. **The Louvre** - Structure ready for content

### Topics (3):
1. **Impressionism** - Videos, Udemy course
2. **Post-Impressionism** - Videos, Van Gogh, Cézanne, Gauguin
3. **Surrealism** - Videos, Udemy course, Dalí, Miró, Frida

### Total Content:
- 73 images
- 50+ videos
- 3 Udemy courses
- 1 complete custom multi-page lesson (Pissarro)
- 20+ exhibitions/sections

## 🔮 Future Additions

Easy to add:
- More museums
- More lessons
- More images
- Cross-linking between topics

The platform is designed to grow organically as you add content!

## ❤️ Final Notes

This is a living gift. Don't feel pressure to have everything perfect. The beauty is in adding to it over time, responding to what she's interested in.

Every time you add a new lesson, it's another way of saying "I see what you love, and I support your learning."

Enjoy building Museo Balizet! 🎨✨
