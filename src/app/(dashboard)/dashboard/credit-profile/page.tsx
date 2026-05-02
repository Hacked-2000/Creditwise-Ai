import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreditProfileForm from "@/components/credit-profile/CreditProfileForm";

export default async function CreditProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const profile = await prisma.creditProfile.findUnique({ where: { userId } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Credit Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Enter your credit score details to get personalized insights
        </p>
      </div>

      <CreditProfileForm initialData={profile} />
    </div>
  );
}
