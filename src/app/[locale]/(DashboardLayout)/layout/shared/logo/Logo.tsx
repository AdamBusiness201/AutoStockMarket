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

const Logo = ({ width = 200, height = 200 }) => {
  return (
    <LinkStyled href="/en">
      <Image
        src="/images/logos/asm_logo.png"
        alt="Company Logo"
        width={width}
        height={height}
      />
      {/* Use Typography here */}
    </LinkStyled>
  );
};

export default Logo;
