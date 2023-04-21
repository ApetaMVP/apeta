import { LoaderArgs } from "@remix-run/node";
  import { logout } from "~/server/auth.server";
  
  
export async function loader({request}: LoaderArgs) {
  return await logout(request)
}
  
  export default function Logout() {
    return (
      <>
      </>
    );
  }
  