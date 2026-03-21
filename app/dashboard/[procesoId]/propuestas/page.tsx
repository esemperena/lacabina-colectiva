import { redirect } from 'next/navigation';

export default async function PropuestasPage({
  params,
}: {
  params: Promise<{ procesoId: string }>;
}) {
  const { procesoId } = await params;
  redirect(`/dashboard/${procesoId}`);
}
