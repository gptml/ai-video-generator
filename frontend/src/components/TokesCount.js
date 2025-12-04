import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TokenIcon from '@mui/icons-material/Token';
import { useSelector } from "react-redux";

export default function CoinCountBounce() {
  const [animate, setAnimate] = useState(false);

  const { tokens, role } = useSelector((state) => state.users.user);


  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(t);
  }, [tokens]);

  if (role === 'admin') {
    return null;
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.8,
        py: 0.6,
        borderRadius: 2,
        fontWeight: 700,
        color: "#fff",
        background: "linear-gradient(135deg, #7d42ff, #4b9fff)",
      }}
    >
      <TokenIcon sx={{ marginRight: 1 }} />
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 600,
          color: "#fff",
          animation: animate ? "bounceShake 0.5s ease" : "none",

          "@keyframes bounceShake": {
            "0%": { transform: "scale(1) translateX(0)" },
            "20%": { transform: "scale(1.25) translateX(-2px)" },
            "40%": { transform: "scale(1.15) translateX(2px)" },
            "60%": { transform: "scale(1.20) translateX(-1px)" },
            "80%": { transform: "scale(1.12) translateX(1px)" },
            "100%": { transform: "scale(1) translateX(0)" },
          }
        }}
      >
        {Math.round(tokens)}
      </Typography>
    </Box>
  );
}
