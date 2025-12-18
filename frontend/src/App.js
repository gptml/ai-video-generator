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
import OpenAiWaterMarkRemoveForm from "./pages/forms/OpenAiWaterMarkRemoveForm";
import QwenImageEditForm from "./pages/forms/QwenImageEditForm";

function App() {
  const token = useSelector(state => state.users.token);

  return (
    <BrowserRouter>
      {token ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create/bytedance/:modelId" element={<ByteDanceForm />} />
          <Route path="/create/grok/:modelId" element={<GrokForm />} />
          <Route path="/create/hailuo/:modelId" element={<HailuoForm />} />
          <Route path="/create/kling/:modelId" element={<KlingForm />} />
          <Route path="/create/openai/:modelId" element={<OpenAiForm />} />
          <Route path="/create/sora-watermark-remove/:modelId" element={<OpenAiWaterMarkRemoveForm />} />
          <Route path="/create/wan/:modelId" element={<WanForm />} />
          <Route path="/create/veo/:modelId" element={<VeoForm />} />
          <Route path="/create/runaway/:modelId" element={<RunawayForm />} />
          <Route path="/create/elevenlabs/:modelId" element={<ElevenLabsForm />} />
          <Route path="/create/four-o-image/:modelId" element={<FourOImageForm />} />
          <Route path="/create/nano-banana/:modelId" element={<NanoBananaForm />} />
          <Route path="/create/flux/:modelId" element={<FluxForm />} />
          <Route path="/create/qwen-image-edit/:modelId" element={<QwenImageEditForm />} />
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
