import "./App.css";
import ImageComparison from "./components/ImageComparison";

// import afterImg from "../public/image/img_snow.jpg";
// import beforeImg from "../public/image/img_forest.jpg";
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* <h2>Comparison image slider</h2> */}
      <ImageComparison
        before="/image/img_forest.jpg"
        after="/image/img_snow.jpg"
        height="420px"
        initial={100} // 50% overlay
        showLabels={true}
      />

      {/* <img src="/image/img_forest.jpg" alt="" /> */}
    </div>
  );
}

export default App;
