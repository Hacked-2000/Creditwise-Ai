import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountsList from "@/components/accounts/AccountsList";

export default async function AccountsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const accounts = await prisma.financialAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financial Accounts</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track all your credit cards, loans, and bank accounts
        </p>
      </div>

      <AccountsList initialAccounts={accounts} />
    </div>
  );
}
