import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import ByteDanceForm from "./pages/forms/ByteDanceForm";
import GrokForm from "./pages/forms/GrokForm";
import HailuoForm from "./pages/forms/HailuoForm";
import KlingForm from "./pages/forms/KlingForm";
import OpenAiForm from "./pages/forms/OpenAiForm";
import WanForm from "./pages/forms/WanForm";
import VeoForm from "./pages/forms/VeoForm";
import RunawayForm from "./pages/forms/RunawayForm";
import ElevenLabsForm from "./pages/forms/ElevenLabsForm";

function App() {
  const token = useSelector(state => state.app.token);

  return (
    <BrowserRouter>
      {token ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create/bytedance" element={<ByteDanceForm />} />
          <Route path="/create/grok" element={<GrokForm />} />
          <Route path="/create/hailuo" element={<HailuoForm />} />
          <Route path="/create/kling" element={<KlingForm />} />
          <Route path="/create/openai" element={<OpenAiForm />} />
          <Route path="/create/wan" element={<WanForm />} />
          <Route path="/create/veo" element={<VeoForm />} />
          <Route path="/create/runaway" element={<RunawayForm />} />
          <Route path="/create/elevenlabs" element={<ElevenLabsForm />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      )}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
