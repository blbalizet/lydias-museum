# Mom's Museum Hub - Setup & Customization Guide

## 🎨 What You've Got

A beautiful, warm, museum-themed learning platform for your mom! It's built with:
- **index.html** - The main page structure
- **style.css** - Beautiful warm earth-tone styling
- **app.js** - All the interactive functionality
- **content.json** - YOUR museum and lesson data (THIS is what you'll edit most)

## 🚀 Quick Start (Testing Locally)

1. Put all 4 files in the same folder
2. Double-click `index.html`
3. It opens in your browser - done!

## 📝 How to Add Content (Editing content.json)

### Adding a New Museum

Copy this template and paste it into the `museums` array:

```json
{
  "id": "unique-museum-id",
  "name": "Museum Name",
  "location": "City, State/Country",
  "description": "Brief description of the museum",
  "visible": true,
  "introVideo": "https://youtu.be/VIDEO_ID",
  "lessons": []
}
```

**Important fields:**
- `id`: Use lowercase with hyphens (e.g., "met-museum")
- `visible`: Set to `true` to show it, `false` to hide it
- `introVideo`: Optional YouTube URL that plays when she clicks the museum

### Adding a YouTube Lesson

Inside a museum's `lessons` array, add:

```json
{
  "id": "unique-lesson-id",
  "title": "Lesson Title",
  "type": "youtube",
  "description": "What this video covers",
  "url": "https://youtu.be/VIDEO_ID"
}
```

### Adding an External Course (Udemy, Coursera, etc.)

```json
{
  "id": "course-id",
  "title": "Course Name",
  "type": "external",
  "description": "What the course covers",
  "url": "https://www.udemy.com/course/...",
  "note": "Ask Bernard for login!"
}
```

### Adding Your Own Custom Multi-Page Lesson

```json
{
  "id": "my-custom-lesson",
  "title": "Understanding Velázquez",
  "type": "custom",
  "author": "From Bernard",
  "content": [
    {
      "type": "text",
      "text": "Page 1: Your introduction text goes here..."
    },
    {
      "type": "image",
      "url": "images/velazquez-painting.jpg",
      "caption": "Las Meninas, 1656"
    },
    {
      "type": "text",
      "text": "Page 2: More text about the painting..."
    },
    {
      "type": "youtube",
      "url": "https://youtu.be/VIDEO_ID",
      "description": "Watch this video to see the technique"
    },
    {
      "type": "text",
      "text": "Page 3: Final thoughts and connections..."
    }
  ]
}
```

**Content types available:**
- `text` - Paragraphs of text
- `image` - Pictures (you'll need to create an `images` folder)
- `youtube` - Embedded YouTube videos with optional description

She'll click through these pages one at a time with Next/Previous buttons.

## 🖼️ Adding Images to Custom Lessons

1. Create a folder called `images` in the same location as index.html
2. Put your images in there (JPG or PNG work great)
3. Reference them in content.json like: `"url": "images/my-picture.jpg"`

## 🎯 Making Museums Visible/Hidden

In content.json, each museum has a `visible` field:
- `"visible": true` - Shows on the main page
- `"visible": false` - Hidden (exists in structure but not shown)

This lets you build out museums gradually. When you're ready to show one, just change false to true!

## 📧 The Request Form

When your mom fills out the request form, it will:
1. Open her default email program
2. Create an email to bernard@agreesearch.com
3. Include her request

You can change this email in `app.js` if needed (search for "bernard@agreesearch.com").

## 📊 Progress Tracking

The app automatically tracks:
- Completed lessons (she clicks "Mark as Complete")
- Recent activity (what she's been viewing)
- Museums explored

All saved in her browser's memory (localStorage).

## 🌐 Deploying to GitHub Pages (Free Hosting!)

### Step 1: Create GitHub Account
Go to github.com and sign up (free)

### Step 2: Create New Repository
1. Click the "+" icon → "New repository"
2. Name it: `moms-museum` (or whatever you like)
3. Make it Public
4. Don't initialize with anything
5. Click "Create repository"

### Step 3: Upload Your Files
1. Click "uploading an existing file"
2. Drag all 4 files (index.html, style.css, app.js, content.json)
3. Add any images folder too
4. Click "Commit changes"

### Step 4: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" in left sidebar
3. Under "Source" select "main" branch
4. Click Save
5. Wait 2-3 minutes
6. Your site will be live at: `https://YOUR-USERNAME.github.io/moms-museum/`

### Step 5: Custom Domain (Optional)
1. Buy domain (like momsmuseum.com from Namecheap, Google Domains, etc.)
2. In GitHub Pages settings, add your custom domain
3. Follow GitHub's instructions to point your domain

## ✏️ Quick Editing Workflow

### To add a new museum or lesson:
1. Open `content.json` in any text editor (Notepad, TextEdit, VS Code)
2. Copy an existing museum/lesson as a template
3. Change the text to your content
4. Save the file
5. If testing locally: Refresh browser
6. If on GitHub: Upload the new content.json (replace old one)

### Common Mistakes to Avoid:
- Don't forget commas between items in arrays
- Make sure every opening `{` has a closing `}`
- Keep IDs unique (no two museums with same ID)
- YouTube URLs can be in any format - the app extracts the video ID

## 🎨 Customizing Colors

If you want to change the color scheme, edit `style.css`:

Top of file has the color palette:
```css
Terracotta: #D4896B
Warm Cream: #F5EBE0
Deep Brown: #6B4423
Gold Accent: #C9A961
```

Replace these hex codes throughout the CSS file to change colors.

## 💡 Tips for Creating Great Lessons

1. **Keep custom lessons to 5-7 pages max** - Easier to digest
2. **Mix content types** - Text, then image, then video keeps it interesting
3. **Personal connections** - Reference things she knows or has experienced
4. **One main idea per page** - Don't overwhelm
5. **End with reflection** - "Think about..." or "Notice how..."

## 🔗 Connecting Topics (Coming in v2)

Right now, lessons live inside museums. In the future, you could add:
- Artist pages that reference multiple museums
- Style pages (Impressionism) that link to relevant museums
- Regional pages (Spanish Art) that connect artists and museums

For now, you can mention these connections in your custom lesson text!

## 📱 iPad Optimization

The site is already optimized for iPad:
- Large touch-friendly buttons
- Readable 18px text
- Responsive grid layout
- Embedded videos work perfectly

## 🆘 Troubleshooting

**Nothing shows up on the page:**
- Check that content.json is in the same folder
- Open browser console (F12) to see errors
- Make sure JSON syntax is valid (no missing commas)

**Videos don't play:**
- Make sure YouTube URLs are correct
- Try different URL formats (youtu.be or youtube.com/watch both work)

**Progress not saving:**
- Progress uses browser localStorage
- If she clears browser data, progress resets
- Consider adding a "backup progress" feature later

## 🎁 Launch Day Tips

1. **Pre-load content** - Have at least 2-3 lessons per visible museum
2. **Test everything** - Click through every lesson before gifting
3. **Write her a welcome message** - Edit the header text in index.html
4. **Create a printout** - Simple "How to Use" guide she can reference
5. **Show her in person** - Walk through one example together

## 📈 Growing the Platform

This is version 1 - deliberately simple. As you get comfortable:

**Easy additions:**
- More museums (just edit JSON)
- More lessons (just edit JSON)
- New images for custom lessons

**Medium additions:**
- Artist pages (similar structure to museums)
- Playlist integration
- Downloadable PDF guides

**Advanced additions:**
- AI-generated placeholder content
- Cross-linking between topics
- Interactive quizzes or reflection prompts

## 🤝 Getting Help

When you paste lessons into Claude for link suggestions:
1. Copy all the text from your lessons
2. Say: "Here are my museum lessons. Suggest where to add internal links between them."
3. I'll tell you which paragraphs should link where

## ❤️ Final Notes

This is a gift that will grow with her curiosity. Don't feel pressure to have everything perfect on day one. The beauty is in adding to it over time, responding to what she's interested in.

Every time you add a new lesson, it's another way of saying "I see what you love, and I support your learning."

That's what makes this special.

Enjoy building it! 🎨✨
