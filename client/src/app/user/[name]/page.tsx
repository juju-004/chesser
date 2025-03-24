import CopyLink from "@/components/user/CopyLink";
import { fetchProfileData } from "@/lib/user";
import { notFound } from "next/navigation";
import Container from "./components/container";
// import Wallet from "./components/Wallet";

export async function generateMetadata({ params }: { params: { name: string } }) {
  const data = await fetchProfileData(params.name);
  if (!data) {
    return {
      description: "User not found",
      robots: {
        index: false,
        follow: false,
        nocache: true,
        noarchive: true
      }
    };
  }
  return {
    title: `${data.name} | chesser`,
    description: `${data.name}'s profile`,
    openGraph: {
      title: `${data.name} | chesser`,
      description: `${data.name}'s profile on chesser`,
      url: `https://ches.su/user/${data.name}`,
      siteName: "chessu",
      locale: "en_US",
      type: "website"
    },
    robots: {
      index: true,
      follow: false,
      nocache: true
    }
  };
}

export default async function Profile({ params }: { params: { name: string } }) {
  const data = await fetchProfileData(params.name);
  if (!data) {
    notFound();
  }

  return <Container>{/* <Wallet></Wallet> */}</Container>;
}
