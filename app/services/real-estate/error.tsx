'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-6 text-[#F5F0E8]">
      <p className="font-[Cormorant_Garamond] text-2xl">Something went wrong.</p>
      <button
        onClick={reset}
        className="border border-[#C9952A] text-[#C9952A] px-6 py-2 text-sm tracking-widest uppercase hover:bg-[#C9952A] hover:text-[#0D0D0D] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
