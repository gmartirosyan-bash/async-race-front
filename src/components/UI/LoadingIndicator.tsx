export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 flex flex-col gap-8 items-center justify-center z-50">
      <div className="flex space-x-3">
        <span
          className="w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: '0s' }}
        ></span>
        <span
          className="w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: '0.15s' }}
        ></span>
        <span
          className="w-5 h-5 bg-white rounded-full animate-bounce"
          style={{ animationDelay: '0.3s' }}
        ></span>
      </div>
      <p style={{ letterSpacing: '0.8em' }} className="ml-3 uppercase font-mono">
        Loading
      </p>
    </div>
  );
}
