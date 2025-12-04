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
import Register from "./pages/Register";
import History from "./pages/History";
import Settings from "./pages/Settings";
import FourOImageForm from "./pages/forms/FourOImageForm";
import NanoBananaForm from "./pages/forms/NanoBananaForm";
import FluxForm from "./pages/forms/FluxForm";

function App() {
  const token = useSelector(state => state.users.token);

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
          <Route path="/create/four-o-image" element={<FourOImageForm />} />
          <Route path="/create/nano-banana" element={<NanoBananaForm />} />
          <Route path="/create/flux" element={<FluxForm />} />
          <Route path="/history" element={<History />} />
          <Route path="/generation-settings" element={<Settings />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
