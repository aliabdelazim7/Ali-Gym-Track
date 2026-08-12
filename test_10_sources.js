import fs from 'fs';

async function testMultiSources() {
  const folders = ["T-Bar_Row_with_Handle", "Lying_T-Bar_Row", "Plank", "Side_Lateral_Raise", "Barbell_Bench_Press_-_Medium_Grip"];
  
  for (const f of folders) {
    const s0 = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${f}/0.jpg`;
    const s1 = `https://raw.githubusercontent.com/fit-app/exercise-db/main/images/${f}.gif`;
    const s2 = `https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80`;
    
    try {
      const r0 = await fetch(s0, { method: 'HEAD' });
      const r2 = await fetch(s2, { method: 'HEAD' });
      console.log(f, '=> S0:', r0.status, '| S2:', r2.status);
    } catch(e) {
      console.log(f, '=> Error:', e.message);
    }
  }
}

testMultiSources();
