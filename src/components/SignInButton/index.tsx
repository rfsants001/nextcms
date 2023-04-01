import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#04D361" />
      {session.user?.name}
      <FiX
        color="#737380"
        className={styles.closeIcon}
        onClick={() => signOut()}
      />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#9440FF" />
      Sign in with Github
    </button>
  );
}
