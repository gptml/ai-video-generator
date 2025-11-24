import grokIcon from '../assets/icons/grok.svg';
import bytedanceIcon from '../assets/icons/bytedance.svg';
import hailuoIcon from '../assets/icons/hailuo.svg';
import openaiIcon from '../assets/icons/openai.svg';
import googleVeoIcon from '../assets/icons/google-veo.svg';
import klingaiIcon from '../assets/icons/klingai.svg';
import vanIcon from '../assets/icons/van.png';
import runawayIcon from '../assets/icons/runaway.svg';
import elevenlabsIcon from '../assets/icons/elevenlabs.svg';

const modelsList = [
  {
    id: 9,
    title: 'ElevenLabs',
    description: 'Выведите свой контент на новый уровень с помощью API ElevenLabs для преобразования текста в речь, обеспечивая реалистичное звучание, которое захватывает аудиторию. На Kie.ai вы можете легко получить доступ к API ElevenLabs TTS для подкастов, приложений и многого другого — без навыков программирования.',
    image: elevenlabsIcon,
    path: '/create/elevenlabs',
    label: 'Озвучка'
  },
  {
    id: 1,
    title: 'Grok',
    description: 'Grok Imagine — это многомодальная модель генерации изображений и видео от xAI, которая преобразует текст или изображения в короткие визуальные результаты с последовательным движением и синхронизированным звуком.',
    image: grokIcon,
    path: '/create/grok'
  },
  {
    id: 2,
    title: 'ByteDance',
    description: 'Модель генерации видео на основе ИИ от ByteDance, которая наследует качество ядра Seedance 1.0 Pro, обеспечивает в 3 раза более быстрый рендеринг, создавая последовательные клипы 1080p со стабильным движением и эффективной вычислительной производительностью.',
    image: bytedanceIcon,
    path: '/create/bytedance'
  },
  {
    id: 3,
    title: 'Hailuo',
    description: 'Hailuo 2.3 — это высокоточная модель видеогенерации на базе искусственного интеллекта от MiniMax, разработанная для создания реалистичных движений, выразительных персонажей и кинематографических визуальных эффектов. Она поддерживает преобразование текста в видео и изображений в видео, обеспечивая стабильную и последовательную обработку сложных движений, изменений освещения и детальной мимики.',
    image: hailuoIcon,
    path: '/create/hailuo'
  },
  {
    id: 4,
    title: 'OpenAI',
    description: 'Усовершенствованная видеомодель искусственного интеллекта OpenAI для структурированной генерации видео, поддерживающая многосценарную последовательность, визуальную согласованность и управление выводом каждые 25 секунд.',
    image: openaiIcon,
    path: '/create/openai'
  },
  {
    id: 5,
    title: 'Veo 3',
    description: 'Google Veo 3 — это модель видеопроизводства нового поколения на базе искусственного интеллекта, разработанная Google DeepMind. Она поддерживает преобразование текста в видео и изображений в видео, создавая высококачественные кинематографические визуальные эффекты с улучшенным пониманием сцены и имитацией естественного движения. С помощью Kie.ai пользователи могут получить доступ к Veo 3 Fast для быстрых и экономичных рабочих процессов или Veo 3 Quality для высококачественного результата. Все эти решения отличаются прозрачными ценами и стабильной инфраструктурой.',
    image: googleVeoIcon,
    path: '/create/veo'
  },
  {
    id: 6,
    title: 'Kling 2.5',
    description: 'Kling 2.5 Turbo — новейшая модель видеогенерации на основе искусственного интеллекта от Kuaishou Kling, предназначенная для создания текстов и изображений. По сравнению с предыдущими версиями, она отличается более точной синхронизацией, более плавными движениями, единообразными художественными стилями и реалистичной симуляцией физики.',
    image: klingaiIcon,
    path: '/create/kling',
  },
  {
    id: 7,
    title: 'Wan',
    description: 'API Wan 2.5 от Alibaba разработан для создания кинематографического видео с помощью искусственного интеллекта и поддерживает преобразование текста в видео (wan2.5-t2v-preview) и изображения в видео (wan2.5-i2v-preview). Он нативно синхронизирует визуальные эффекты с диалогами, фоновым звуком и фоновой музыкой. Поддержка различных разрешений (720p, 1080p) и…',
    image: vanIcon,
    path: '/create/wan',
  },
  {
    id: 8,
    title: 'Runway',
    description: 'Создавайте высококачественные видео из текста и изображений с помощью Runway API. Используйте Runway AI API для бесшовной интеграции и получите ключ Runway API уже сегодня.',
    image: runawayIcon,
    path: '/create/runaway'
  },
]

export default modelsList;
