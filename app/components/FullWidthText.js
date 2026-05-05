export default function FullWidthText({ text }) {
  return (
    <div className="flex justify-between w-full uppercase">
      {text.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))}
    </div>
  );
}