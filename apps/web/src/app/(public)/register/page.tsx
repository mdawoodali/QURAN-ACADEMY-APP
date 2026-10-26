import RegisterClient from "./RegisterClient";

export const instant = false;

export default async function RegisterPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;

  return <RegisterClient initialError={searchParams?.error} />;
}
