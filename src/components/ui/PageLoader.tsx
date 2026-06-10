import Spinner from './Spinner';

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
