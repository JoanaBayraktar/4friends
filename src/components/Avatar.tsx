import { getInitials } from "@/lib/auth";

type AvatarProps = {
  name: string;
  color: string;
  imageUrl?: string | null;
  className?: string;
};

// Round avatar: shows the uploaded profile photo if there is one,
// otherwise falls back to a colored circle with the person's initials.
// `className` should contain sizing (h-*/w-*), text size, and any extra
// utility classes (shadow, transitions, ...) — it's applied either way.
export function Avatar({ name, color, imageUrl, className = "" }: AvatarProps) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
