import { useMode } from "./hooks/useMode";

function App() {
  const { setMode } = useMode();
  return (
    <>
      <div onClick={() => setMode("light")}>light</div>
      <div onClick={() => setMode("dark")}>dark</div>
      <div onClick={() => setMode("system")}>system</div>
    </>
  );
}

export default App;
