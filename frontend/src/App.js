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
import NanoBananaProForm from "./pages/forms/NanoBananaProForm";
import FluxForm from "./pages/forms/FluxForm";
import OpenAiWaterMarkRemoveForm from "./pages/forms/OpenAiWaterMarkRemoveForm";
import QwenImageEditForm from "./pages/forms/QwenImageEditForm";
import Users from "./pages/Users";
import SunoForm from "./pages/forms/SunoForm";
import NanoBananaForm from "./pages/forms/NanoBananaForm";
import QwenImageForm from "./pages/forms/QwenImageForm";
import SeedreamForm from "./pages/forms/SeedreamForm";
import WanSpeechToVideoForm from "./pages/forms/WanSpeechToVideoForm";
import ElevenLabsSpeechTextForm from "./pages/forms/ElevenLabsSpeechTextForm";
import ElevenLabsSoundEffectForm from "./pages/forms/ElevenLabsSoundEffectForm";
import ElevenLabsSoundIsolationForm from "./pages/forms/ElevenLabsSoundIsolationForm";
import IdeogramForm from "./pages/forms/IdeogramForm";
import RecreaftUpscaleForm from "./pages/forms/RecreaftUpscaleForm";
import RecreaftForm from "./pages/forms/RecreaftForm";
import InfinitalkForm from "./pages/forms/InfinitalkForm";
import KlingAvatarForm from "./pages/forms/KlingAvatarForm";
import TopazVideoForm from "./pages/forms/TopazVideoForm";
import Hailuo2Form from "./pages/forms/Hailuo2Form";
import WanAnimate from "./pages/forms/WanAnimate";
import TopazImageForm from "./pages/forms/TopazImageForm";

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
          <Route path="/create/nano-banana/:modelId" element={<NanoBananaProForm />} />
          <Route path="/create/flux/:modelId" element={<FluxForm />} />
          <Route path="/create/qwen-image-edit/:modelId" element={<QwenImageEditForm />} />
          <Route path="/create/suno/:modelId" element={<SunoForm />} />
          <Route path="/create/nano-banana-image-preview/:modelId" element={<NanoBananaForm />} />
          <Route path="/create/qwen-image/:modelId" element={<QwenImageForm />} />
          <Route path="/create/seedream/:modelId" element={<SeedreamForm />} />
          <Route path="/create/wan-speech-to-video/:modelId" element={<WanSpeechToVideoForm />} />
          <Route path="/create/elevenlabs-speech-text/:modelId" element={<ElevenLabsSpeechTextForm />} />
          <Route path="/create/elevenlabs-sound-effect/:modelId" element={<ElevenLabsSoundEffectForm />} />
          <Route path="/create/elevenlabs-audio-isolation/:modelId" element={<ElevenLabsSoundIsolationForm />} />
          <Route path="/create/ideogram/:modelId" element={<IdeogramForm />} />
          <Route path="/create/recraft-upscale/:modelId" element={<RecreaftUpscaleForm />} />
          <Route path="/create/recraft/:modelId" element={<RecreaftForm />} />
          <Route path="/create/infinitalk/:modelId" element={<InfinitalkForm />} />
          <Route path="/create/kling-avatar/:modelId" element={<KlingAvatarForm />} />
          <Route path="/create/topaz-video/:modelId" element={<TopazVideoForm />} />
          <Route path="/create/hailuo-02/:modelId" element={<Hailuo2Form />} />
          <Route path="/create/van-animate/:modelId" element={<WanAnimate />} />
          <Route path="/create/topaz-image/:modelId" element={<TopazImageForm />} />
          <Route path="/history" element={<History />} />
          <Route path="/generation-settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
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
