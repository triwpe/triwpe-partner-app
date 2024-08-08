import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>This is the test main page</h1>
      <h2>In the future we will replace with the new landing page</h2>
      <div>
        {" "}
        <Link href="/sign-in" className="text-blue-600 font-bold">
          Click here
        </Link>{" "}
        to sign in
      </div>
    </div>
  );
}
