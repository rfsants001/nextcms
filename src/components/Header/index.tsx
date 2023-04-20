import Link from "next/link";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

export function Header() {
  const { asPath } = useRouter();

  function verifyRouter(path: string) {
    return asPath === path;
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <h2>next.CMS</h2>
        <nav>
          <Link href="/" className={verifyRouter("/") ? styles.active : ""}>
            Home
          </Link>

          <Link
            href="/posts"
            className={verifyRouter("/posts") ? styles.active : ""}
          >
            Posts
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
