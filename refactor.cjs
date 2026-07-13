const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find the main element start and footer start
const mainStart = code.indexOf('<main className="pb-24 pt-24">');
const footerStart = code.indexOf('<footer className="bg-slate-950');

const mainContent = code.substring(mainStart, footerStart);

const homeContentComponent = `
const HomeContent = ({ t, mousePos, handleMouseMove, journals }: any) => (
  <>
    {/* --- Ambient Background --- */}
    <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] -z-20" />
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-sky-400/15 blur-[120px] rounded-full -z-10 pointer-events-none animate-float" />
    <div className="absolute top-96 -right-64 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
    ${mainContent}
  </>
);
`;

// Replace the entire return of App()
const appReturnStart = code.indexOf('  return (\n    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200');
const newAppReturn = `  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 relative overflow-hidden flex flex-col">
      <Navbar />
      {renderContent()}
      <Footer />
    </div>
  );
}`;

code = code.substring(0, appReturnStart) + newAppReturn;

// Insert HomeContent component before export default function App()
code = code.replace('export default function App() {', homeContentComponent + '\n\nexport default function App() {');

fs.writeFileSync('src/App.tsx', code);
console.log('Successfully refactored App.tsx layout structure.');
