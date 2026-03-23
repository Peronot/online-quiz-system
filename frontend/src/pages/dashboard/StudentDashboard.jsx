function StudentDashboard({ student, onExit }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-[#1E3A8A]">Student Dashboard</h1>
        <p className="mt-3 text-slate-600">
          Welcome, {student?.student_name ?? "Student"} ({student?.student_id ?? "ID"}).
        </p>
        <ul className="mt-5 list-disc space-y-1 pl-5 text-slate-600">
          <li>View assigned quizzes from access links</li>
          <li>Open quiz questions and submit answers</li>
          <li>Track your quiz participation</li>
        </ul>
        <button
          type="button"
          onClick={onExit}
          className="mt-6 rounded-xl bg-[#1E3A8A] px-4 py-2 font-medium text-white transition hover:bg-[#172d6d]"
        >
          Exit Student Session
        </button>
      </section>
    </main>
  );
}

export default StudentDashboard;
