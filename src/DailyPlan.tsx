
export default function DailyLockInPlan() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8 w-[850px] mx-auto">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black tracking-wide">
          DAILY LOCK-IN PLAN
        </h1>
        <div className="border-b-4 border-[#005792] mt-2 w-full" />
        <p className="text-lg font-semibold mt-4 mb-2 text-black">
          Maximize Focus, Minimize Distraction
        </p>
        <div className="border-b border-[#005792] w-full" />
      </div>

      {/* Single Rule Box */}
      <div className="bg-[#E8F6FF] border-2 border-[#005792] rounded-2xl p-5 mb-10 shadow-sm">
        <h2 className="text-2xl font-bold bg-[#005792] text-white p-3 rounded-xl mb-4">
          THE SINGLE RULE: AUTHORIZED ACTIVITIES ONLY
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The items below represent the <b>only permitted daily activities</b>.
          Any activity, distraction, or “anything else” not explicitly listed
          here is <b>STRICTLY PROHIBITED</b>.
        </p>
      </div>

      {/* Block A */}
      <h2 className="text-3xl font-bold text-[#005792] mb-2">
        Block A: Core Focus & Growth
      </h2>
      <p className="text-gray-600 mb-4">
        High-value, priority activities scheduled during peak mental hours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Professional & Personal Development */}
        <div className="bg-[#E8F6FF] border-2 border-[#005792] rounded-2xl p-5 shadow-sm">
          <h3 className="text-xl font-bold bg-[#005792] text-white p-3 rounded-xl mb-4">
            Professional & Personal Development
          </h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li><b>Work on Personal Project</b>: Dedicated, deep work sessions.</li>
            <li><b>Problem Solving</b>: Coding challenges, analytical work.</li>
            <li><b>Driving</b>: Necessary transit only.</li>
          </ul>
        </div>

        {/* Fitness & Health */}
        <div className="bg-[#E8F6FF] border-2 border-[#005792] rounded-2xl p-5 shadow-sm">
          <h3 className="text-xl font-bold bg-[#005792] text-white p-3 rounded-xl mb-4">
            Fitness & Health
          </h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li><b>Workout and Diet</b>: Structured training + strict meals.</li>
            <li><b>Running</b>: Scheduled cardio sessions.</li>
          </ul>
        </div>

      </div>

      {/* Block B */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-[#005792] mb-2">
          Block B: Maintenance & Decompression
        </h2>
        <p className="text-gray-600 mb-4">
          Necessary upkeep and essential, highly limited breaks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Strictly Limited Leisure */}
          <div className="bg-[#E8F6FF] border-2 border-[#005792] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xl font-bold bg-[#005792] text-white p-3 rounded-xl mb-4">
              Strictly Limited Leisure
            </h3>
            <ul className="list-disc ml-5 text-gray-700 mb-4">
              <li>Use this single time slot for ALL unstructured leisure (gaming, TV, browsing).</li>
            </ul>
            <div className="text-center text-red-600 font-bold text-lg">
              HARD LIMIT: 1–3 HOURS TOTAL
            </div>
          </div>

          {/* Passive Input & Social Check-Ins */}
          <div className="bg-[#E8F6FF] border-2 border-[#005792] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xl font-bold bg-[#005792] text-white p-3 rounded-xl mb-4">
              Passive Input & Social Check-Ins
            </h3>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li><b>Reading, Podcast</b>: Passive input for growth or pleasure.</li>
              <li><b>WhatsApp</b>: Brief scheduled check-ins only.</li>
              <li><b>Going Out</b>: Must be scheduled and goal-directed.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Footer line & slogan */}
      <div className="border-b mt-10 border-[#005792] w-full" />

      <div className="text-center mt-6 text-lg font-bold text-gray-800">
        YOUR FOCUS STARTS NOW.
      </div>
    </div>
  );
}
