import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import { ArrowForward, Security, MenuBook, CheckCircle } from "@mui/icons-material";
import styles from './Hero.module.css';

const Hero = ({ onGetStarted }) => {
  return (
    <Box className={styles.heroContainer}>
      <Box className={styles.heroContent}>
        <Box className={styles.badge}>
          <Typography variant="body2" component="span" fontWeight={500}>
            AI-Powered Medical Translation
          </Typography>
        </Box>
        
        <Typography variant="h2" component="h1" className={styles.heroTitle}>
          Understand Your
          <Box component="span" className={styles.primaryText}>
            Medications Simply
          </Box>
        </Typography>
        
        <Typography variant="h6" className={styles.heroSubtitle}>
          Get clear, easy-to-read explanations of complex medical information. 
          No more confusing medical jargon - just simple answers you can trust.
        </Typography>

        <Box className={styles.buttonGroup}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={onGetStarted}
            endIcon={<ArrowForward />}
            className={styles.primaryButton}
          >
            Get Started
          </Button>
          <Button 
            variant="outlined" 
            size="large"
          >
            Learn More
          </Button>
        </Box>

        <Grid container spacing={5} className={styles.featureGrid} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} className={styles.featureCard}>
              <Box className={styles.featureIcon}>
                <Security sx={{ fontSize: 32 }} color="primary" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Verified Sources
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Information from trusted medical databases like OpenFDA and RxNorm
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} className={styles.featureCard}>
              <Box className={styles.featureIcon}>
                <MenuBook sx={{ fontSize: 32 }} color="primary" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Easy to Read
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                All explanations written at a middle-school reading level
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} className={styles.featureCard}>
              <Box className={styles.featureIcon}>
                <CheckCircle sx={{ fontSize: 32 }} color="success" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                AI-Powered
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Advanced AI translates complex medical terms into plain language
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Hero;
