import { useState, useRef } from 'react';
import { Settings, X, Download } from 'lucide-react';

interface Colors {
  primary: string;
  background: string;
}

interface Content {
  title: string;
  subtitle: string;
  ruleTitle: string;
  ruleText: string;
  blockATitle: string;
  blockADesc: string;
  blockBTitle: string;
  blockBDesc: string;
  footerText: string;
  profTitle: string;
  profItems: string[];
  fitnessTitle: string;
  fitnessItems: string[];
  leisureTitle: string;
  leisureText: string;
  leisureLimit: string;
  socialTitle: string;
  socialItems: string[];
}

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  isTextarea?: boolean;
  fieldKey: string;
}

export default function DailyLockInPlan() {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [colors, setColors] = useState<Colors>({
    primary: '#005792',
    background: '#E8F6FF'
  });
  
  const [content, setContent] = useState<Content>({
    title: 'DAILY LOCK-IN PLAN',
    subtitle: 'Maximize Focus, Minimize Distraction',
    ruleTitle: 'THE SINGLE RULE: AUTHORIZED ACTIVITIES ONLY',
    ruleText: 'The items below represent the only permitted daily activities. Any activity, distraction, or "anything else" not explicitly listed here is STRICTLY PROHIBITED.',
    blockATitle: 'Block A: Core Focus & Growth',
    blockADesc: 'High-value, priority activities scheduled during peak mental hours.',
    blockBTitle: 'Block B: Maintenance & Decompression',
    blockBDesc: 'Necessary upkeep and essential, highly limited breaks.',
    footerText: 'YOUR FOCUS STARTS NOW.',
    
    profTitle: 'Professional & Personal Development',
    profItems: [
      'Work on Personal Project: Dedicated, deep work sessions.',
      'Problem Solving: Coding challenges, analytical work.',
      'Driving: Necessary transit only.'
    ],
    fitnessTitle: 'Fitness & Health',
    fitnessItems: [
      'Workout and Diet: Structured training + strict meals.',
      'Running: Scheduled cardio sessions.'
    ],
    
    leisureTitle: 'Strictly Limited Leisure',
    leisureText: 'Use this single time slot for ALL unstructured leisure (gaming, TV, browsing).',
    leisureLimit: 'HARD LIMIT: 1–3 HOURS TOTAL',
    socialTitle: 'Passive Input & Social Check-Ins',
    socialItems: [
      'Reading, Podcast: Passive input for growth or pleasure.',
      'WhatsApp: Brief scheduled check-ins only.',
      'Going Out: Must be scheduled and goal-directed.'
    ]
  });
  
  const updateColor = (key: keyof Colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };
  
  const updateContent = (key: keyof Content, value: string | string[]) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };
  
  const updateArrayItem = (key: keyof Content, index: number, value: string) => {
    setContent(prev => {
      const arr = prev[key];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [key]: arr.map((item, i) => i === index ? value : item)
        };
      }
      return prev;
    });
  };

  const EditableText = ({ value, onChange, className = '', style, isTextarea = false, fieldKey }: EditableTextProps) => {
    const isEditing = editingField === fieldKey;
    
    if (isEditing) {
      if (isTextarea) {
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditingField(null)}
            autoFocus
            className={`${className} border-2 border-blue-500 rounded px-2 py-1 w-full`}
            rows={3}
          />
        );
      }
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditingField(null)}
          autoFocus
          className={`${className} border-2 border-blue-500 rounded px-2 py-1 w-full`}
        />
      );
    }
    
    return (
      <div
        onClick={() => setEditingField(fieldKey)}
        className={`${className} cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-2 py-1 transition-colors`}
        style={style}
        title="Click to edit"
      >
        {value}
      </div>
    );
  };

  const exportToPDF = async () => {
    const settingsBtn = document.querySelector('.settings-btn') as HTMLElement;
    const downloadBtn = document.querySelector('.download-btn') as HTMLElement;
    if (settingsBtn) settingsBtn.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
    
    try {
      const element = contentRef.current;
      const opt = {
        margin: 10,
        filename: 'daily-lock-in-plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // @ts-ignore - html2pdf is loaded via CDN
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      if (settingsBtn) settingsBtn.style.display = 'block';
      if (downloadBtn) downloadBtn.style.display = 'block';
    }
  };

  return (
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      
      <div className="min-h-screen bg-white text-gray-900 p-8 relative">
        
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <button
            onClick={exportToPDF}
            className="download-btn p-3 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg"
            title="Export to PDF"
          >
            <Download size={24} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="settings-btn p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-lg"
            title="Color Settings"
          >
            {showSettings ? <X size={24} /> : <Settings size={24} />}
          </button>
        </div>

        {showSettings && (
          <div className="fixed top-20 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-6 w-80 z-40">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Color Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateColor('primary', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => updateColor('background', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer border"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              💡 Click on any text in the document to edit it inline
            </p>
          </div>
        )}

        <div ref={contentRef} className="w-[850px] mx-auto">
          <div className="text-center mb-8">
            <EditableText
              value={content.title}
              onChange={(val) => updateContent('title', val)}
              className="text-4xl font-bold text-black tracking-wide inline-block"
              fieldKey="title"
            />
            <div className="border-b-4 mt-2 w-full" style={{ borderColor: colors.primary }} />
            <EditableText
              value={content.subtitle}
              onChange={(val) => updateContent('subtitle', val)}
              className="text-lg font-semibold mt-4 mb-2 text-black inline-block"
              fieldKey="subtitle"
            />
            <div className="border-b w-full" style={{ borderColor: colors.primary }} />
          </div>

          <div className="rounded-2xl p-5 mb-10 shadow-sm border-2" style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
            <EditableText
              value={content.ruleTitle}
              onChange={(val) => updateContent('ruleTitle', val)}
              className="text-2xl font-bold text-white p-3 rounded-xl mb-4"
              style={{ backgroundColor: colors.primary }}
              fieldKey="ruleTitle"
            />
            <EditableText
              value={content.ruleText}
              onChange={(val) => updateContent('ruleText', val)}
              className="text-gray-700 leading-relaxed"
              isTextarea={true}
              fieldKey="ruleText"
            />
          </div>

          <EditableText
            value={content.blockATitle}
            onChange={(val) => updateContent('blockATitle', val)}
            className="text-3xl font-bold mb-2 inline-block"
            style={{ color: colors.primary }}
            fieldKey="blockATitle"
          />
          <EditableText
            value={content.blockADesc}
            onChange={(val) => updateContent('blockADesc', val)}
            className="text-gray-600 mb-4"
            fieldKey="blockADesc"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="rounded-2xl p-5 shadow-sm border-2" style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
              <EditableText
                value={content.profTitle}
                onChange={(val) => updateContent('profTitle', val)}
                className="text-xl font-bold text-white p-3 rounded-xl mb-4"
                style={{ backgroundColor: colors.primary }}
                fieldKey="profTitle"
              />
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {content.profItems.map((item, index) => {
                  const colonIndex = item.indexOf(':');
                  const isEditing = editingField === `profItem-${index}`;
                  
                  if (isEditing) {
                    return (
                      <li key={index}>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem('profItems', index, e.target.value)}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className="border-2 border-blue-500 rounded px-2 py-1 w-full"
                        />
                      </li>
                    );
                  }
                  
                  if (colonIndex === -1) {
                    return (
                      <li key={index}>
                        <span
                          onClick={() => setEditingField(`profItem-${index}`)}
                          className="cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-1"
                        >
                          {item}
                        </span>
                      </li>
                    );
                  }
                  const boldPart = item.substring(0, colonIndex);
                  const rest = item.substring(colonIndex);
                  return (
                    <li key={index}>
                      <span
                        onClick={() => setEditingField(`profItem-${index}`)}
                        className="cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-1"
                      >
                        <b>{boldPart}</b>{rest}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl p-5 shadow-sm border-2" style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
              <EditableText
                value={content.fitnessTitle}
                onChange={(val) => updateContent('fitnessTitle', val)}
                className="text-xl font-bold text-white p-3 rounded-xl mb-4"
                style={{ backgroundColor: colors.primary }}
                fieldKey="fitnessTitle"
              />
              <ul className="list-disc ml-5 text-gray-700 space-y-1">
                {content.fitnessItems.map((item, index) => {
                  const colonIndex = item.indexOf(':');
                  const isEditing = editingField === `fitnessItem-${index}`;
                  
                  if (isEditing) {
                    return (
                      <li key={index}>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem('fitnessItems', index, e.target.value)}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          className="border-2 border-blue-500 rounded px-2 py-1 w-full"
                        />
                      </li>
                    );
                  }
                  
                  if (colonIndex === -1) {
                    return (
                      <li key={index}>
                        <span
                          onClick={() => setEditingField(`fitnessItem-${index}`)}
                          className="cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-1"
                        >
                          {item}
                        </span>
                      </li>
                    );
                  }
                  const boldPart = item.substring(0, colonIndex);
                  const rest = item.substring(colonIndex);
                  return (
                    <li key={index}>
                      <span
                        onClick={() => setEditingField(`fitnessItem-${index}`)}
                        className="cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-1"
                      >
                        <b>{boldPart}</b>{rest}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          <div className="mt-10">
            <EditableText
              value={content.blockBTitle}
              onChange={(val) => updateContent('blockBTitle', val)}
              className="text-3xl font-bold mb-2 inline-block"
              style={{ color: colors.primary }}
              fieldKey="blockBTitle"
            />
            <EditableText
              value={content.blockBDesc}
              onChange={(val) => updateContent('blockBDesc', val)}
              className="text-gray-600 mb-4"
              fieldKey="blockBDesc"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="rounded-2xl p-5 shadow-sm border-2" style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
                <EditableText
                  value={content.leisureTitle}
                  onChange={(val) => updateContent('leisureTitle', val)}
                  className="text-xl font-bold text-white p-3 rounded-xl mb-4"
                  style={{ backgroundColor: colors.primary }}
                  fieldKey="leisureTitle"
                />
                <ul className="list-disc ml-5 text-gray-700 mb-4">
                  <li>
                    <EditableText
                      value={content.leisureText}
                      onChange={(val) => updateContent('leisureText', val)}
                      className="inline-block"
                      fieldKey="leisureText"
                    />
                  </li>
                </ul>
                <div className="text-center text-red-600 font-bold text-lg">
                  <EditableText
                    value={content.leisureLimit}
                    onChange={(val) => updateContent('leisureLimit', val)}
                    className="inline-block"
                    fieldKey="leisureLimit"
                  />
                </div>
              </div>

              <div className="rounded-2xl p-5 shadow-sm border-2" style={{ backgroundColor: colors.background, borderColor: colors.primary }}>
                <EditableText
                  value={content.socialTitle}
                  onChange={(val) => updateContent('socialTitle', val)}
                  className="text-xl font-bold text-white p-3 rounded-xl mb-4"
                  style={{ backgroundColor: colors.primary }}
                  fieldKey="socialTitle"
                />
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  {content.socialItems.map((item, index) => {
                    const colonIndex = item.indexOf(':');
                    const isEditing = editingField === `socialItem-${index}`;
                    
                    if (isEditing) {
                      return (
                        <li key={index}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateArrayItem('socialItems', index, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="border-2 border-blue-500 rounded px-2 py-1 w-full"
                          />
                        </li>
                      );
                    }
                    
                    if (colonIndex === -1) {
                      return (
                        <li key={index}>
                          <span
                            onClick={() => setEditingField(`socialItem-${index}`)}
                            className="cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-1"
                          >
                            {item}
                          </span>
                        </li>
                      );
                    }
                    const boldPart = item.substring(0, colonIndex);
                    const rest = item.substring(colonIndex);
                    return (
                      <li key={index}>
                        <span
                          onClick={() => setEditingField(`socialItem-${index}`)}
                          className="cursor-pointer hover:bg-gray-100 hover:bg-opacity-50 rounded px-1"
                        >
                          <b>{boldPart}</b>{rest}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
          </div>

          <div className="border-b mt-10 w-full" style={{ borderColor: colors.primary }} />

          <div className="text-center mt-6 text-lg font-bold text-gray-800">
            <EditableText
              value={content.footerText}
              onChange={(val) => updateContent('footerText', val)}
              className="inline-block"
              fieldKey="footerText"
            />
          </div>
        </div>
      </div>
    </>
  );
}