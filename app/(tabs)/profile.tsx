import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SignOutModal } from "@/components/ui/SignOutModal";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Edit3,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  Star,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleLogout = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = async () => {
    setShowSignOutModal(false);
    await logout();
    router.replace("/auth");
  };

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <User size={40} color={Colors.primary} strokeWidth={2} />
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Edit3 size={16} color={Colors.textOnPrimary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <Typography variant="h3" weight="bold" style={styles.userName}>
          {"Guest User"}
        </Typography>
        <Typography variant="body" weight="regular" style={styles.userEmail}>
          {user?.email || "guest@dermatouch.com"}
        </Typography>
        <View style={styles.membershipBadge}>
          <Star
            size={12}
            color={Colors.accent}
            fill={Colors.accent}
            strokeWidth={0}
          />
          <Typography
            variant="caption"
            weight="semiBold"
            style={styles.membershipText}
          >
            Premium Member
          </Typography>
        </View>
      </View>
    </View>
  );

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    rightComponent,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>
            <Icon size={20} color={Colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.menuText}>
            <Typography
              variant="body"
              weight="semiBold"
              style={styles.menuTitle}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body"
                weight="regular"
                style={styles.menuSubtitle}
              >
                {subtitle}
              </Typography>
            )}
          </View>
        </View>

        <View style={styles.menuItemRight}>
          {rightComponent && <View>{rightComponent}</View>}
          {showChevron && (
            <ChevronRight
              size={20}
              color={Colors.textTertiary}
              strokeWidth={2}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        <View style={styles.section}>
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>
            Account
          </Typography>

          <MenuItem
            icon={Mail}
            title="Email Address"
            subtitle={user?.email || "guest@dermatouch.com"}
            onPress={() => {}}
          />

          <MenuItem
            icon={Phone}
            title="Phone Number"
            subtitle="Add your phone number"
            onPress={() => {}}
          />

          <MenuItem
            icon={MapPin}
            title="Shipping Address"
            subtitle="Manage your addresses"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>
            Preferences
          </Typography>

          <MenuItem
            icon={Bell}
            title="Notifications"
            subtitle="Push notifications and emails"
            showChevron={false}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: Colors.border,
                  true: Colors.primary + "40",
                }}
                thumbColor={
                  notificationsEnabled ? Colors.primary : Colors.textTertiary
                }
              />
            }
          />

          <MenuItem
            icon={Settings}
            title="App Settings"
            subtitle="Language, theme, and more"
            onPress={() => {}}
          />

          <MenuItem
            icon={Heart}
            title="Wishlist"
            subtitle="Your saved products"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Typography variant="body" weight="bold" style={styles.sectionTitle}>
            Support
          </Typography>

          <MenuItem
            icon={HelpCircle}
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={() => {}}
          />

          <MenuItem
            icon={Shield}
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon={LogOut}
            title="Sign Out"
            onPress={handleLogout}
            showChevron={false}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body" weight="medium" style={styles.footerText}>
            Dermatouch
          </Typography>
          <Typography
            variant="caption"
            weight="regular"
            style={styles.footerSubtext}
          >
            Made with 🌿 for your skin
          </Typography>
        </View>
      </ScrollView>

      <SignOutModal
        visible={showSignOutModal}
        onConfirm={confirmSignOut}
        onCancel={() => setShowSignOutModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    paddingTop: 32,
    backgroundColor: Colors.surface,
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative" as const,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editButton: {
    position: "absolute" as const,
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  membershipText: {
    color: Colors.accent,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    color: Colors.textSecondary,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footer: {
    alignItems: "center",
    padding: 24,
    marginTop: 16,
  },
  footerText: {
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  footerSubtext: {
    color: Colors.textTertiary,
  },
});
