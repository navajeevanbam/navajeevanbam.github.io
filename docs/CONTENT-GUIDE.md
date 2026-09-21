# Adding events, stories, and photo galleries

A guide for teachers and staff at Navajeevan Seva Ashram.

You do not need to write website code. For each new item, you will add a small text file and a folder of photographs. The website builds the page for you.

## Choose what you want to add

| Choose this | When to use it | What visitors see |
| --- | --- | --- |
| **Event** | Announce an activity or record an activity that has happened. | Date, place, details, and one main photograph. |
| **Story** | Share news, an experience, or information about a service. | An article with one main photograph. |
| **Gallery** | Share several photographs from one occasion. | An album with a name, date, and photos that visitors can enlarge. |

These are separate pages. Adding an event does not automatically create a gallery. You can create both for the same occasion.

## Before you begin

1. Open the website project folder in your text editor. A text editor such as Visual Studio Code is suitable; Word and Google Docs are not suitable for saving these website files.
2. Keep your title, short description, main text, and photographs ready.
3. Follow the matching example below. The examples are practice content, not confirmed Ashram activities.

If the project has not been set up on your computer, ask the person who maintains the website to help with the initial setup. These instructions assume you can already open the project and preview the website.

### Understanding folder names

All paths below start inside the website project folder. For example:

`src/content/events/reading-day.md`

means: open **src**, then **content**, then **events**, and create a file called **reading-day.md**.

A file ending in `.md` is a plain text document. The letters mean Markdown. Make sure your editor does not save it as `reading-day.md.txt`.

### The matching-name rule

Give your item a short filename using lowercase English letters, numbers, and hyphens. Do not use spaces.

- Good: `reading-day-2026.md`
- Avoid: `Reading Day 2026.md`

Its photograph folder must use exactly the same name, without `.md`:

```text
Text:   src/content/events/reading-day-2026.md
Photos: public/images/events/reading-day-2026/
```

The filename is part of the page’s address. Choose it once and keep it; changing it later changes the address people may have saved. You can change the displayed title without renaming the file.

### Preparing photographs

Use `.jpg`, `.jpeg`, `.png`, or `.webp` files. Use lowercase filenames, such as `cover.jpg` or `children-reading.jpg`.

**Keep the correct ending.** If your photo is a PNG, use `cover.png` in both the folder and the text file. Renaming `photo.png` to `photo.jpg` does not convert it into a JPEG. Ask for help converting a phone photo if it ends in `.heic`.

The website reads image dimensions automatically. You do not need to measure the photos or edit any image registry.

### A few typing rules

- Copy both lines containing `---`. The details go between them; article text goes below the second line.
- Keep the labels to the left of `:` exactly as shown. Change the information to the right.
- Keep quotation marks around text and dates. Use straight quotes (`"`), not the curly quotation marks inserted by Word.
- Dates use **year-month-day**. `2026-10-15` means **15 October 2026**.
- Keep `true` and `false` lowercase, without quotes.
- In lists, keep the spaces at the beginning of each line. Use spaces, not the Tab key.

`sample: true` displays a sample label. Use it for practice, fictional content, or the existing AI-generated examples. Change it to `sample: false` only when replacing the example with a real activity or article and its real photographs. This setting is **not** a draft switch: sample items can still appear on the website.

## 1. Add a new event

### Step 1: Create the photograph folder

Inside `public/images/events/`, create a folder called:

```text
reading-day-2026
```

Put your main photograph inside it and name it `cover.jpg`.

Your photograph is now at:

```text
public/images/events/reading-day-2026/cover.jpg
```

### Step 2: Create the event file

Inside `src/content/events/`, create `reading-day-2026.md`.

Copy this whole example into the file:

```markdown
---
title: "Community Reading Day"
excerpt: "An afternoon of reading and storytelling together."
date: "2026-10-15"
image: "cover.jpg"
imageAlt: "Children and a teacher reading together at a table"
category: "Learning together"
status: "upcoming"
location: "Ashram activity room"
time: "3:00 PM – 5:00 PM"
sample: true
---

Join us for an afternoon of reading and storytelling.

## What will happen

We will read short stories together and discuss our favourite characters.

## Who can take part

Please contact the Ashram to ask about taking part.
```

### Step 3: Replace the example information

| Label | What to enter |
| --- | --- |
| `title` | The event’s name. |
| `excerpt` | A short introduction, usually one sentence. |
| `date` | The event date, not the date you write the page. |
| `image` | The exact name of your photograph, including its ending. |
| `imageAlt` | A sentence describing what can be seen in the photo. This helps people who use a screen reader. |
| `category` | A short group name, such as `Community care` or `Education`. |
| `status` | `upcoming` for an event still to happen, or `past` for one that has happened. |
| `location` | Where the event takes place. |
| `time` | The time. Delete the whole line if you do not know it. |
| `sample` | Keep `true` while practising; use `false` for real content and photographs. |

Replace the paragraphs below the second `---` with your own event details.

### Optional: Add a timetable

If you have a confirmed timetable, insert this **above the second `---`**, aligned with the other details:

```yaml
schedule:
  - time: "3:00 PM"
    activity: "Welcome and introductions"
  - time: "3:15 PM"
    activity: "Group reading"
```

If you do not need a timetable, leave it out completely.

### Step 4: Save and check

Save the file. Follow **Preview and check your work** below. Your event will appear in **Events**. Events are ordered by date, newest first.

After the event, change `status: "upcoming"` to `status: "past"`. This does not happen automatically.

Adding an event does not automatically add it to the homepage’s selected **Projects & Programs**. Ask the website maintainer if it should be featured there.

## 2. Add a new story

### Step 1: Add the photograph

Create this folder and put a photograph named `cover.jpg` inside it:

```text
public/images/stories/reading-together/
```

### Step 2: Create the story file

Create `src/content/stories/reading-together.md` and copy this example:

```markdown
---
title: "The Joy of Reading Together"
excerpt: "How a shared story can bring a group closer together."
date: "2026-10-16"
image: "cover.jpg"
imageAlt: "A teacher sharing a picture book with a group of children"
category: "Learning together"
author: "Ashram teaching team"
readTime: 2
sample: true
---

A shared book can be the beginning of a lovely conversation.

## A moment to remember

Write about what happened and what made the experience special.

## What we learned

Share a thought or lesson from the experience.
```

### Step 3: Add your own writing

Change the title, introduction, photo details, and paragraphs. The meanings of `image`, `imageAlt`, `category`, and `sample` are the same as for events.

- `date` is the story’s publication date. You may delete the whole line if no date is appropriate.
- `author` is the writer’s name or team. You may delete the whole line.
- `readTime` is an estimated reading time in minutes. Write a number such as `2`, without quotes. You may delete the whole line.

Do not add `status`, `location`, or a timetable to a story; those are event details.

Save and preview. The article appears in **Stories**. Dated stories appear newest first; stories without dates appear after them, in title order.

A story about a service still belongs in the `stories` folder. Adding it does not automatically change the homepage’s five selected services.

## 3. Add a new gallery album

An album groups photographs from one occasion. You can use one photograph or many.

### Step 1: Create the album’s photograph folder

Create:

```text
public/images/gallery/reading-day-2026/
```

For this example, add three photographs named:

```text
reading-circle.jpg
picture-books.jpg
volunteers.jpg
```

### Step 2: Create the album file

Create `src/content/gallery/reading-day-2026.md` and copy this example:

```markdown
---
title: "Community Reading Day"
date: "2026-10-15"
description: "A collection of moments from our reading afternoon."
sample: true
cover: "reading-circle.jpg"
images:
  - filename: "reading-circle.jpg"
    alt: "Children sitting in a circle while a teacher reads a story"
    caption: "Sharing a story together."
  - filename: "picture-books.jpg"
    alt: "Picture books arranged on a classroom table"
    caption: "Books ready for the afternoon."
  - filename: "volunteers.jpg"
    alt: "Volunteers arranging chairs and books in the activity room"
    caption: "Getting ready to welcome everyone."
---
```

### Step 3: Describe the album and photographs

| Label | What it means |
| --- | --- |
| `title` | The event or occasion’s name. |
| `date` | The date of the occasion. This is required for an album. |
| `description` | A short introduction to the album. |
| `sample` | `true` for a practice album; `false` for a real occasion with real photographs. |
| `cover` | The photograph displayed on the album card. It must also appear in the `images` list. |
| `filename` | The exact filename of one photograph in this album’s folder. |
| `alt` | A description of what is visible in that photograph. Required for every photo. |
| `caption` | The sentence shown below the photo. Optional; if omitted, the website uses `alt`. |

Unlike events and stories, the gallery page uses `description` and the photo list. You do not need to write an article below the final `---`.

### Add another photograph

1. Put the new file in the same album folder.
2. Copy one three-line photograph entry under `images:`.
3. Change its filename, description, and caption.
4. Keep the indentation exactly the same and keep the entry above the final `---`.

Example of one entry:

```yaml
  - filename: "group-photo.jpg"
    alt: "The reading group standing together in the courtyard"
    caption: "A moment together at the end of the afternoon."
```

Putting a photograph in the folder alone does **not** add it to the album. It must also be listed in the file. Do not list the same filename twice.

To change the order, move the complete photograph entries up or down. To remove a photograph, remove its complete entry. If it was the cover, choose another listed photograph for `cover`.

### Step 4: Save and check

The album appears in **Gallery**. Albums are ordered newest first. The three newest albums also appear automatically in the homepage gallery preview.

Open the album, then click a photograph. Check the large image, caption, next/previous controls, and Close button. The keyboard’s arrow keys move between photographs; Escape closes the viewer.

## Simple formatting for event and story text

Use this formatting only in the article text below the second `---`:

```markdown
This is a normal paragraph.

This is another paragraph. Leave a blank line between paragraphs.

## A section heading

- First point
- Second point

**These words appear in bold.**
```

Use `##` for headings inside an article. The page already shows your title as its main heading.

## Preview and check your work

### Open the local website

If the preview is already running, save your files and refresh the browser.

Otherwise, open the editor’s **Terminal** in the website project folder. A terminal is a small panel where you type commands. Enter:

```sh
npm run dev
```

Press Enter. Leave that terminal running. Open the address it prints, normally `http://localhost:4321/`.

Use the website navigation to open **Events**, **Stories**, or **Gallery**, then open your new item. Check the title, date, text, spelling, and photographs. Narrow the browser window to check the phone layout too.

If a newly added page is missing, stop the preview with **Control + C** in its terminal, run `npm run dev` again, and refresh the browser.

### Check before publishing

Open a second terminal in the same project folder, or stop the preview with Control + C. Run these commands **one at a time**, pressing Enter after each finishes:

```sh
npm run check
npm run build
npm test
```

If a command reports an error or failure, correct it before continuing. Copy the error message and ask the website maintainer for help if needed.

**Saving a file or checking it locally does not publish it to the public website.** Give the maintainer both the new `.md` file and its matching photograph folder. The project has a GitHub Pages publishing workflow; the maintainer can review and publish the changes using the project’s normal process.

## Common problems and how to fix them

| Problem | What to check |
| --- | --- |
| The picture is missing, or the build says `cannot read public/images/...` | Check the photo exists in the named folder. Match every letter and the `.jpg`, `.png`, or `.webp` ending in the text file. |
| The album says `Cover must name an image in the album` | Copy a filename from the `images` list into `cover`. |
| The album reports duplicate filenames | Remove the repeated photo entry. Each filename should appear once in the list. |
| An error mentions `imageAlt` or `alt` | Add a short description of the photograph. Do not leave it empty. |
| An error points to a line in the text file | Check quotation marks, colons, the two `---` lines, and list indentation. Compare with the example. |
| The page says “Sample” | Check `sample`. Change it to `false` only if you have replaced the practice details and images with real content. |
| A past event still appears under Upcoming | Change its `status` to `past`, save, check, and publish again. |
| A new page does not appear in the preview | Save the file in the correct content folder and restart the local preview. |
| A new album is not on the homepage | Only the three newest albums appear there. Check its date; it should still appear on the Gallery page. |

## Final checklist

- The text filename and photograph folder name match.
- The filenames in the text match the actual photos.
- Every photo has a clear description.
- Dates, location, and names are correct.
- Example wording has been replaced; `sample` accurately describes the content.
- The item opens correctly in the local preview.
- All three checking commands finish successfully.
- Both the text file and photographs are included when sending the update for publication.
