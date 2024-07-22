import Link from "next/link";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none", 
}));

const Logo = () => {
  return (
    <LinkStyled href="/en">
      <Image src="/images/logos/asm_logo.png" alt="Company Logo" width={200} height={100} />
      {/* Use Typography here */}
    </LinkStyled>
  );
};

export default Logo;
