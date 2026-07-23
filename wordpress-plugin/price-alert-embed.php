<?php
/**
 * Plugin Name: AI Price Alert Embed
 * Description: Easily embed the AI Price Alert Tracker into your WordPress site with a simple shortcode.
 * Version: 1.0.0
 * Author: AI Price Alert
 * License: GPL v2 or later
 * Text Domain: price-alert-embed
 */

if (!defined('ABSPATH')) {
    exit;
}

class Price_Alert_Embed_Plugin {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_shortcode('price_alert', array($this, 'shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_plugin_links'));
    }

    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'height'      => '600px',
            'width'       => '100%',
            'show_header' => 'yes',
            'show_button' => 'yes',
            'theme'       => 'light',
            'class'       => '',
        ), $atts);

        $height = esc_attr($atts['height']);
        $width = esc_attr($atts['width']);
        $show_header = $atts['show_header'] === 'yes';
        $show_button = $atts['show_button'] === 'yes';
        $theme = esc_attr($atts['theme']);
        $class = esc_attr($atts['class']);

        $custom_css = get_option('pa_custom_css', '');

        ob_start();
        ?>
        <div class="price-alert-embed-wrapper <?php echo $theme; ?> <?php echo $class; ?>">
            <?php if ($show_header) : ?>
            <div class="pae-header">
                <div class="pae-logo">🔔</div>
                <h2 class="pae-title">AI Price Alert Tracker</h2>
                <p class="pae-subtitle">Never miss a price drop again!</p>
            </div>
            <?php endif; ?>

            <div class="pae-frame-container">
                <iframe 
                    src="https://price-alerter.onrender.com"
                    class="pae-frame"
                    style="width: <?php echo $width; ?>; height: <?php echo $height; ?>;"
                    title="AI Price Alert Tracker"
                    loading="lazy"
                    frameborder="0">
                </iframe>
            </div>

            <?php if ($show_button) : ?>
            <div class="pae-footer">
                <a href="https://price-alerter.onrender.com" target="_blank" rel="noopener noreferrer" class="pae-button">
                    🚀 Open Full Tracker
                </a>
                <p class="pae-powered">
                    Powered by <strong>AI Price Alert</strong>
                </p>
            </div>
            <?php endif; ?>
        </div>

        <?php if ($custom_css) : ?>
        <style type="text/css">
            <?php echo $custom_css; ?>
        </style>
        <?php endif; ?>

        <style>
            .price-alert-embed-wrapper {
                max-width: 100%;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }

            .price-alert-embed-wrapper.dark {
                background: #1a1a2e;
            }

            .pae-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }

            .pae-logo {
                font-size: 48px;
                margin-bottom: 10px;
                animation: bounce 2s infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            .pae-title {
                margin: 0 0 8px 0;
                font-size: 24px;
                font-weight: 700;
            }

            .pae-subtitle {
                margin: 0;
                opacity: 0.9;
                font-size: 14px;
            }

            .pae-frame-container {
                background: #f5f5f5;
                padding: 0;
            }

            .price-alert-embed-wrapper.dark .pae-frame-container {
                background: #16213e;
            }

            .pae-frame {
                display: block;
                border: none;
            }

            .pae-footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #eee;
            }

            .price-alert-embed-wrapper.dark .pae-footer {
                background: #0f3460;
                border-top: 1px solid #1a1a2e;
            }

            .pae-button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            }

            .pae-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
            }

            .pae-powered {
                margin: 12px 0 0 0;
                font-size: 12px;
                color: #666;
            }

            .price-alert-embed-wrapper.dark .pae-powered {
                color: #aaa;
            }

            .pae-powered strong {
                color: #667eea;
            }
        </style>
        <?php
        return ob_get_clean();
    }

    public function enqueue_assets() {
        wp_enqueue_style(
            'price-alert-embed-style',
            plugins_url('style.css', __FILE__),
            array(),
            '1.0.0'
        );
    }

    public function register_settings() {
        register_setting('pa_settings_group', 'pa_custom_css');
        register_setting('pa_settings_group', 'pa_default_height');
        register_setting('pa_settings_group', 'pa_default_theme');
    }

    public function add_admin_menu() {
        add_options_page(
            'Price Alert Embed',
            'Price Alert Embed',
            'manage_options',
            'price-alert-embed',
            array($this, 'admin_page')
        );
    }

    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>🔔 Price Alert Embed Settings</h1>
            
            <form method="post" action="options.php">
                <?php settings_fields('pa_settings_group'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">Default Height</th>
                        <td>
                            <input type="text" name="pa_default_height" value="<?php echo esc_attr(get_option('pa_default_height', '600px')); ?>" class="regular-text">
                            <p class="description">Default iframe height (e.g., 600px, 80vh)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Default Theme</th>
                        <td>
                            <select name="pa_default_theme">
                                <option value="light" <?php selected(get_option('pa_default_theme'), 'light'); ?>>Light</option>
                                <option value="dark" <?php selected(get_option('pa_default_theme'), 'dark'); ?>>Dark</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Custom CSS</th>
                        <td>
                            <textarea name="pa_custom_css" rows="10" cols="50" class="large-text code"><?php echo esc_textarea(get_option('pa_custom_css', '')); ?></textarea>
                            <p class="description">Add custom CSS to style the embed container</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Save Settings'); ?>
            </form>

            <div class="card" style="max-width: 800px; margin-top: 30px;">
                <h2>📖 Usage Instructions</h2>
                <h3>Shortcode</h3>
                <code>[price_alert]</code>
                
                <h3>With Custom Options</h3>
                <code>[price_alert height="500px" theme="dark" show_header="yes"]</code>
                
                <h3>PHP Function</h3>
                <code><?php echo do_shortcode('[price_alert]'); ?></code>

                <h3>Gutenberg Block</h3>
                <p>Search for "Price Alert" in the Gutenberg block inserter.</p>
            </div>
        </div>
        <?php
    }

    public function add_plugin_links($links) {
        $plugin_links = array(
            '<a href="options-general.php?page=price-alert-embed">Settings</a>',
        );
        return array_merge($plugin_links, $links);
    }
}

Price_Alert_Embed_Plugin::get_instance();

