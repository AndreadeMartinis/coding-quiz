import Link from "next/link";

function Signature() {
  return (
    <Link
      href="https://www.andreademartinis.it/"
      target="_blank"
      className="signature"
    >
      Developed by <span>Andrea de Martinis</span>
    </Link>
  );
}

export default Signature;
