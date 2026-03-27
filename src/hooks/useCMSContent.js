import { useState, useEffect } from 'react';

// Hook to load content from CMS files
export const useCMSContent = (contentType, filename = null) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        if (contentType === 'books') {
          // Load individual book files
          const bookFiles = [
            'The_Seasons_That_Made_Me.json',
            'Lucky_Penny.json', 
            'Faithful_Hearts.json',
            'Wanderlust.json',
            'The_Work_and_the_Stories.json'
          ];
          
          const bookPromises = bookFiles.map(async (file) => {
            const url = `/edmond-porter-react-site/content/books/${file}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${file}: ${response.status}`);
            return response.json();
          });
          
          const books = await Promise.all(bookPromises);
          
          // Sort books by order field with automatic reordering for duplicates
          const sortedBooks = books.sort((a, b) => {
            const orderA = a.order || 999; // Default to high number if no order
            const orderB = b.order || 999;
            return orderA - orderB;
          });
          
          // Handle automatic reordering: if multiple books have same order, 
          // increment subsequent books to maintain unique ordering
          let orderCounter = 1;
          const reorderedBooks = sortedBooks.map((book, index) => {
            if (index > 0 && sortedBooks[index - 1].order === book.order) {
              orderCounter++;
            }
            return { ...book, order: book.order + orderCounter - 1 };
          });
          
          setContent(reorderedBooks);
        } else if (contentType === 'hero') {
          // Load hero content
          const url = '/edmond-porter-react-site/content/hero.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load hero content: ${response.status}`);
          const heroData = await response.json();
          setContent(heroData);
        } else if (contentType === 'home-bio') {
          // Load home bio content
          const url = '/edmond-porter-react-site/content/home-bio.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load home-bio content: ${response.status}`);
          const homeBioData = await response.json();
          setContent(homeBioData);
        } else if (contentType === 'about-bio') {
          // Load about-bio content
          const url = '/edmond-porter-react-site/content/about-bio.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load about-bio content: ${response.status}`);
          const aboutBioData = await response.json();
          setContent(aboutBioData);
        } else if (contentType === 'medium-section') {
          // Load medium section content
          const url = '/edmond-porter-react-site/content/medium-section.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load medium-section content: ${response.status}`);
          const mediumSectionData = await response.json();
          setContent(mediumSectionData);
        } else if (contentType === 'timeline') {
          // Load timeline data from JavaScript file to avoid GitHub Pages routing issues
          // This allows Pages CMS to update content while bypassing JSON routing problems
          try {
            // Try to load the dynamically generated timeline data
            const script = document.createElement('script');
            script.src = '/edmond-porter-react-site/timeline-data.js';
            script.onload = () => {
              if (window.timelineData) {
                setContent(window.timelineData);
              } else {
                // Fallback to hardcoded data
                setContent(fallbackContent.timeline);
              }
              setLoading(false);
            };
            script.onerror = () => {
              // Fallback to hardcoded data
              setContent(fallbackContent.timeline);
              setLoading(false);
            };
            document.head.appendChild(script);
            return; // Don't set loading to false yet, wait for script to load
          } catch (error) {
            // Fallback to hardcoded data
            const timelineData = fallbackContent.timeline;
            setContent(timelineData);
          }
        }
      } catch (err) {
        console.error(`Error loading ${contentType} content:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentType]);

  return { content, loading, error };
};

// Fallback hardcoded content (for when CMS fails)
export const fallbackContent = {
  hero: {
    title: "Turbulent Waters",
    cover: "Turbulent_Waters.webp",
    blurb: "In the shadow of Idaho's biggest engineering project, Jake and Anna are on opposite sides of the river—until the current pulls them together and the flood takes everything else.",
    buttonText: "Pre-order Now",
    link: "https://www.amazon.com/Turbulent-Waters-Edmond-Porter-ebook/dp/B0GRLFBQJX",
    bookStatus: "coming-soon",
    showSpecificDate: false,
    releaseDate: "",
    customDateText: ""
  },
  books: [
    { 
      title: "The Seasons That Made Me", 
      order: 1,
      type: "ESSAY COLLECTION",
      description: "A collection of deeply personal essays on growth, loss, and the cyclical nature of our creative lives.",
      cover: "The_Seasons_That_Made_Me.webp",
      buyLink: "https://www.amazon.com/Seasons-That-Made-Me-Collection-ebook/dp/B0FXD1M3QB"
    },
    {
      title: "Lucky Penny",
      order: 2,
      type: "ANTHOLOGY",
      description: 'Short stories of magical realism invite our imaginations to wander and wonder "what if?"',
      cover: "Lucky_Penny.webp", 
      buyLink: "https://www.amazon.com/Lucky-Penny-Short-Magical-Realism-ebook/dp/B0G3NWKQC8"
    },
    {
      title: "Faithful Hearts",
      order: 3,
      type: "ANTHOLOGY",
      description: "Heartwarming stories and poems celebrating our furriest family members: our pets.",
      cover: "Faithful_Hearts.webp",
      buyLink: "https://www.amazon.com/Faithful-Hearts-Celebrating-Peoples-Relationships-ebook/dp/B0DP368PKG"
    },
    {
      title: "Wanderlust",
      order: 4,
      type: "ANTHOLOGY",
      description: "Join seventeen authors as they take you on journeys through Asia, the Americas, and Europe.",
      cover: "Wanderlust.webp",
      buyLink: "https://www.amazon.com/Wanderlust-Collection-Travel-Angela-Acosta-ebook/dp/B0CM8Y7W2T"
    },
    {
      title: "The Work and the Stories",
      order: 5,
      type: "ANTHOLOGY",
      description: "An eclectic collection of funny memories and poignant challenges from LDS missionary experiences.",
      cover: "The_Work_and_the_Stories.webp",
      buyLink: "https://www.amazon.com/Work-Stories-Collection-Missionary-Experiences-ebook/dp/B0BW4X2N86"
    }
  ],
  homeBio: {
    teaserHeadline: "The Man Behind the Prose",
    teaserBody: "Edmond A Porter is a novelist and essayist whose work explores the quiet intersections of human connection and historical resonance.",
    teaserImage: "Edmond_Headshot.webp",
    readMoreLink: "Read Full Biography"
  },
  mediumSection: {
    headline: "Latest Musings & Essays",
    description: "Occasional thoughts on the craft of writing, historical echoes, and creative life.",
    posts: []
  },
  aboutBio: {
    bioLabel: "The Modern Archivist",
    bioHeadline: "The Modern Archivist",
    bioSubtitle: "Writing is not just a recording of facts, but a retrieval of souls from the quiet corners of the past.",
    bioBody: `## My name is Edmond, and I am from Idaho.

I am four generations removed from the Mormon pioneers who settled in the Idaho part of Cache Valley. Even though I lived more than one-third of my life in Washington and the last three years in Utah, I'm still from Idaho. More specifically, I am from Preston, known for Napoleon Dynamite and That Famous Preston Night Rodeo, not potatoes.

Being from Preston doesn't necessarily mean I lived in the city of Preston. Any place in Franklin County qualifies as being from Preston. I grew up on a farm my grandparents bought ten miles east of Preston when they were newly married. My father bought it from his father.

I guess you could classify our family business as dairy farming, but there were a few chickens, pigs, and turkeys thrown into the mix. Life on the farm was great. I was driving a tractor by the time I was six, motorbikes by age nine, and trucks as soon as I was tall enough to see out of the windshield and depress the clutch at the same time.

### My name is Edmond, and I am a geek.

I spent a lot of time alone operating farm equipment, and my mind needed stimulation. As I spent my days on a tractor seat or in the barn milking cows, I pretended to be a television announcer detailing the events of the day. My narration was spoken aloud if I was alone and under my breath if I wasn't.

Despite my tendency to talk to myself, I developed a reputation for being intelligent in school. Reading and basic math were easy for me, and my classmates noticed. Once a reputation is gained, it must be maintained, and that is not easy. I read every night and morning on the school bus and always turned in my homework on time. Instead of playing softball at recess, I became the umpire. Not everybody agrees with the umpire's call, but it can't be disputed if everyone thinks you are the smartest kid in class.

High school cracked the façade of being smart, but struggling for Cs in college and being turned down twice for a graduate program busted it into little pieces. I picked up the pieces, graduated with a degree in biology, and went on to have a forty-five-year career in the canned food industry.

### My name is Edmond, and I am a son.

When I was in ninth grade and as tall as my peers for the last time in my life, I thought about trying out for the junior high football team. My father, who had no interest in sports, discouraged me from playing. He didn't say I couldn't try out, but there was a not-so-subtle reminder that there were chores to do every night after school at the same time as football practice. That made me realize how important I was to the family farm. I was almost persuaded by that argument alone, but then he told me about his brother, who had been an athlete in high school and played on an eight-man football team. A knee injury that appeared not to be serious plagued his brother all his life. It was the first time I understood just how much my father cared about my welfare.

### My name is Edmond, and I am a father and grandfather.

There is nothing more important than family. Families form a chain that stretches for generations in both directions. I knew my grandparents well. I lived with my parents for twenty-five years, minus a brief period here and there, before I got married and formed my nuclear family. My wife and I raised five children, and now we have eight grandchildren. I am the middle link of the chain.

When our oldest was a newborn, I often stood by her crib listening to make sure she was breathing. I learned that was not necessary. Children breathe on their own, and they grow up on their own.

As they grew, I read to each of them every night at bedtime. I went to band concerts, choir concerts, and drama performances. Now they do those things for their children, and occasionally, Grandpa gets to experience some of those things with the next generation. I am content to be the middle link in the generational chain.

### My name is Edmond. I am a writer.

I began writing when I was in third grade. I tried my hand at news articles, fiction, and fan fiction. Most of the writing I did in high school remained hidden, except for the editorials I wrote as editor of my high school newspaper. In college, I had one paper that a professor thought might be worthy of publication, but I didn't know how to proceed. I wrote budget proposals and other work-related documents. Now that I am retired, I have been published in three anthologies, two newsletters, and online. My first short book of essays and poems was published on Amazon in October of 2025. Recently, I was awarded first and third place in the first chapter and creative nonfiction divisions of the League of Utah Writers' annual contest.

My first novel, Turbulent Waters, a historical romance set surrounding the building and ultimate failure of the Teton Dam, is set for release on June 1, 2026, to coincide with the 50th anniversary of the Teton Dam Flood.`,
    bioImage: "Edmond_Seated.webp"
  },
  timeline: [
    {
      "year": "2014",
      "milestone1_title": "The First Spark",
      "milestone1_description": "Publication of 'Whispers in the Grain' in a leading literary journal, marking his professional debut."
    },
    {
      "year": "2017",
      "milestone1_title": "Crossing the Continent",
      "milestone1_description": "Relocated to the Olympic Peninsula. The rugged landscapes began to heavily influence his work."
    },
    {
      "year": "2021",
      "milestone1_title": "A Breakthrough Release",
      "milestone1_description": "Debut novel 'The Archivist's Daughter' is released to critical acclaim.",
      "milestone2_title": "Literary Award",
      "milestone2_description": "Received recognition for outstanding contribution to contemporary literature."
    },
    {
      "year": "2026",
      "milestone1_title": "First novel published",
      "milestone1_description": "Turbulent Waters releases June 1, 2026"
    }
  ],
  about: {
    headline: "The Man Behind the Prose",
    photo: "Edmond_Headshot.webp",
    bioBody: "Edmond A Porter is a contemporary author whose work explores the intricate tapestry of human experience through compelling narratives and thoughtful prose.\n\nWith a background that spans multiple disciplines and cultures, Edmond brings a unique perspective to his writing, crafting stories that resonate with readers from all walks of life. His work often delves into themes of connection, resilience, and the transformative power of human relationships.\n\nEdmond's published works include several acclaimed anthologies and essay collections, each showcasing his ability to weave together personal experience with universal truths. Whether exploring the complexities of family bonds, the journey of personal growth, or the beauty found in everyday moments, his writing invites readers to see the world through fresh eyes.\n\nWhen not writing, Edmond enjoys spending time with his family, exploring the natural beauty of the Pacific Northwest, and engaging with the vibrant literary community that continues to inspire his work."
  }
};
