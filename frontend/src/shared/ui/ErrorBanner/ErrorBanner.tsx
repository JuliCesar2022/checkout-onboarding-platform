interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  // TODO: implement error styling with Tailwind
  return <div role="alert">{message}</div>;
}
