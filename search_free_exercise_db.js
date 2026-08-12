import fs from 'fs';

async function searchIndex() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");
    if (res.ok) {
      const data = await res.json();
      console.log('Total exercises in free-exercise-db:', data.length);
      
      const searchTerms = [
        "plank", "t-bar", "lateral raise", "triceps", "biceps", "leg extension",
        "calf", "bulgarian", "leg curl", "face pull", "row", "bench press"
      ];

      searchTerms.forEach(term => {
        const matches = data.filter(e => e.name.toLowerCase().includes(term));
        console.log(`\n--- Matches for "${term}" (${matches.length}) ---`);
        matches.slice(0, 5).forEach(m => console.log(`Name: "${m.name}" | Folder: "${m.images[0]}"`));
      });
    } else {
      console.log('Fetch index status:', res.status);
    }
  } catch(e) {
    console.error('Error fetching index:', e);
  }
}

searchIndex();
