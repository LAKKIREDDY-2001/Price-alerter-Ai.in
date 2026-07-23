# WordPress Integration for Price Alert Website

## Option 1: Gutenberg Embed Block (Recommended)

Copy and paste this into a WordPress page using the **Code Editor** or **Custom HTML** block:

```html
<!-- wp:embed {"url":"https://price-alerter.onrender.com","type":"rich","providerNameSlug":"embed"} -->
<figure class="wp-block-embed is-type-rich is-provider-embed wp-block-embed-embed">
    <div class="wp-block-embed__wrapper">
        https://price-alerter.onrender.com
    </div>
</figure>
<!-- /wp:embed -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
```

---

## Option 2: Custom HTML Block (With Styling)

```html
<!-- wp:heading {"level":3} -->
<h3>🔔 AI Price Alert Tracker</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Track prices from Amazon, Flipkart, Myntra, Ajio, Meesho, Snapdeal, Tata CLiQ & Reliance Digital. Get instant notifications when prices drop!</p>
<!-- /wp:paragraph -->

<!-- wp:embed {"url":"https://price-alerter.onrender.com","type":"rich"} -->
<figure class="wp-block-embed is-type-rich is-provider-embed wp-block-embed-embed">
    <div class="wp-block-embed__wrapper">
        <iframe 
            src="https://price-alerter.onrender.com" 
            width="100%" 
            height="600" 
            frameborder="0" 
            scrolling="yes"
            style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        </iframe>
        <a href="https://price-alerter.onrender.com">https://price-alerter.onrender.com</a>
    </div>
</figure>
<!-- /wp:embed -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
    <!-- wp:button {"backgroundColor":"#10b981","textColor":"#ffffff","style":{"border":{"radius":"8px"}}} -->
    <div class="wp-block-button">
        <a class="wp-block-button__link has-text-color has-white-color has-background wp-element-button" href="https://price-alerter.onrender.com" target="_blank" rel="noopener">Open in New Tab ↗</a>
    </div>
    <!-- /wp:button -->
</div>
<!-- /wp:buttons -->
```

---

## Option 3: WordPress Shortcode (Add to theme functions.php)

Add this to your theme's `functions.php` file:

```php
<?php
// Price Alert Shortcode
function price_alerter_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '600px',
        'width' => '100%',
        'show_title' => 'yes',
        'show_button' => 'yes'
    ), $atts);
    
    ob_start();
    ?>
    <div class="price-alerter-embed">
        <?php if ($atts['show_title'] === 'yes') : ?>
            <h3 style="text-align: center; margin-bottom: 10px;">🔔 AI Price Alert Tracker</h3>
        <?php endif; ?>
        
        <div class="embed-container" style="position: relative; width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
            <iframe 
                src="https://price-alerter.onrender.com" 
                style="width: 100%; height: 100%; border: none; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
                loading="lazy"
                title="AI Price Alert Tracker">
            </iframe>
        </div>
        
        <?php if ($atts['show_button'] === 'yes') : ?>
            <p style="text-align: center; margin-top: 15px;">
                <a href="https://price-alerter.onrender.com" target="_blank" style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                    🚀 Open Price Alert Tracker ↗
                </a>
            </p>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('price_alert', 'price_alerter_shortcode');

// Gutenberg Block Registration
function price_alerter_gutenberg_blocks() {
    wp_register_script(
        'price-alerter-block',
        get_stylesheet_directory_uri() . '/price-alerter-block.js',
        array('wp-blocks', 'wp-element', 'wp-editor')
    );
    
    register_block_type('price-alerter/embed', array(
        'editor_script' => 'price-alerter-block',
    ));
}
add_action('init', 'price_alerter_gutenberg_blocks');
?>
```

**Usage in WordPress Editor:**
```
[price_alert height="500px" show_title="yes" show_button="yes"]
```

---

## Option 4: Complete WordPress Page Template

Create a file named `page-price-tracker.php` in your theme folder:

```php
<?php
/*
Template Name: Price Alert Tracker
*/
get_header();
?>

<div class="price-tracker-page">
    <style>
        .price-tracker-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .price-tracker-header {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
            margin-bottom: 30px;
        }
        .price-tracker-header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .embed-container {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        .embed-container iframe {
            width: 100%;
            height: 700px;
            border: none;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .feature-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
        }
        .feature-card i {
            font-size: 2.5rem;
            color: #667eea;
            margin-bottom: 15px;
        }
    </style>
    
    <div class="price-tracker-header">
        <h1>🔔 AI Price Alert Tracker</h1>
        <p>Never miss a price drop again! Track prices from 8+ shopping sites.</p>
    </div>
    
    <div class="embed-container">
        <iframe 
            src="https://price-alerter.onrender.com" 
            title="AI Price Alert Tracker"
            loading="lazy">
        </iframe>
    </div>
    
    <div class="features-grid">
        <div class="feature-card">
            <i class="fa fa-bell"></i>
            <h3>Instant Alerts</h3>
            <p>Get notified immediately when prices drop</p>
        </div>
        <div class="feature-card">
            <i class="fa fa-chart-line"></i>
            <h3>Price History</h3>
            <p>View detailed price trends and predictions</p>
        </div>
        <div class="feature-card">
            <i class="fa fa-shopping-cart"></i>
            <h3>8+ Sites</h3>
            <p>Amazon, Flipkart, Myntra, and more</p>
        </div>
        <div class="feature-card">
            <i class="fa fa-mobile"></i>
            <h3>Multi-Channel</h3>
            <p>Email, Telegram, WhatsApp notifications</p>
        </div>
    </div>
</div>

<?php get_footer(); ?>
```

---

## Option 5: WordPress Plugin (Complete)

Create `price-alerter-embed.php` in `wp-content/plugins/`:

```php
<?php
/*
Plugin Name: Price Alert Embed
Description: Embed the AI Price Alert Tracker in your WordPress site
Version: 1.0
Author: Your Name
*/

if (!defined('ABSPATH')) exit;

class PriceAlerterEmbed {
    
    public function __construct() {
        add_shortcode('price_alert_embed', array($this, 'shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
    }
    
    public function enqueue_assets() {
        wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    }
    
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600px',
            'width' => '100%',
            'show_header' => 'true',
            'show_features' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div class="price-alerter-wrapper">
            <?php if ($atts['show_header'] === 'true') : ?>
            <div class="pa-header">
                <h2>🔔 AI Price Alert Tracker</h2>
                <p>Track prices and get instant notifications</p>
            </div>
            <?php endif; ?>
            
            <div class="pa-embed-frame">
                <iframe 
                    src="https://price-alerter.onrender.com" 
                    style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
                    loading="lazy"
                    title="AI Price Alert Tracker">
                </iframe>
            </div>
            
            <div class="pa-actions">
                <a href="https://price-alerter.onrender.com" target="_blank" class="pa-btn pa-btn-primary">
                    ↗ Open Full Tracker
                </a>
            </div>
        </div>
        
        <style>
            .price-alerter-wrapper {
                max-width: 100%;
                margin: 20px 0;
            }
            .pa-header {
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px 12px 0 0;
            }
            .pa-header h2 { margin: 0 0 5px 0; }
            .pa-header p { margin: 0; opacity: 0.9; }
            .pa-embed-frame {
                background: #fff;
            }
            .pa-actions {
                text-align: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 0 0 12px 12px;
            }
            .pa-btn {
                display: inline-block;
                padding: 10px 20px;
                background: #10b981;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
            }
            .pa-btn:hover { background: #059669; }
        </style>
        <?php
        return ob_get_clean();
    }
    
    public function add_admin_menu() {
        add_options_page(
            'Price Alert Embed',
            'Price Alert Settings',
            'manage_options',
            'price-alerter-embed',
            array($this, 'admin_page')
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Price Alert Embed Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('pa_settings'); ?>
                <?php do_settings_sections('pa_settings'); ?>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}

new PriceAlerterEmbed();
```

---

## Quick Implementation Steps:

1. **Simple Embed**: Use Option 1 directly in WordPress Custom HTML block
2. **Advanced Features**: Use Option 3 (shortcode) or Option 5 (plugin)
3. **Dedicated Page**: Use Option 4 to create a custom page template

---

## Supported Sites for Price Tracking:
- ✅ Amazon
- ✅ Flipkart  
- ✅ Myntra
- ✅ Ajio
- ✅ Meesho
- ✅ Snapdeal
- ✅ Tata CLiQ
- ✅ Reliance Digital

---

## Usage in WordPress Editor:

```
Basic:        [price_alert_embed]
Custom size:  [price_alert_embed height="500px"]
No header:    [price_alert_embed show_header="false"]
```


