import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UserNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <span className="hidden text-sm sm:block text-gray-300">{user.email}</span>
      <form action={signOut}>
        <button className="rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link href="/login" className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
      Login
    </Link>
  );
}