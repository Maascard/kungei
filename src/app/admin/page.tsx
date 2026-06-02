import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSettingsMap } from "@/lib/content";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [bookings, blocked, settings, gallery, menu, reviews] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blockedRange.findMany({ orderBy: { startDate: "asc" } }),
    getSettingsMap(),
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.review.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  // Сериализуем даты в строки для клиента
  const data = {
    bookings: bookings.map((b) => ({
      ...b,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })),
    blocked: blocked.map((b) => ({
      ...b,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      createdAt: b.createdAt.toISOString(),
    })),
    settings,
    gallery,
    menu,
    reviews,
  };

  return <AdminDashboard initial={data} />;
}
