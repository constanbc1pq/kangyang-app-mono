import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN_NAMES } from '@/constants/app';
import { View, useTheme } from 'tamagui';
import { Heart, Activity, Users, User } from 'lucide-react-native';
import { HealthScreen } from '@/screens/HealthScreen';
import { WellnessScreen } from '@/screens/WellnessScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { PersonalCenterScreen } from '@/screens/PersonalCenterScreen';
import { AIConsultationScreen } from '@/screens/AIConsultationScreen';
import { HealthReportScreen } from '@/screens/HealthReportScreen';
import { DeviceManagementScreen } from '@/screens/DeviceManagementScreen';
import { DataConfirmationScreen } from '@/screens/device/DataConfirmationScreen';
import { MedicationReminderScreen } from '@/screens/MedicationReminderScreen';
import { TaskListScreen } from '@/screens/TaskListScreen';
import { TaskDetailScreen } from '@/screens/TaskDetailScreen';
import { TaskFormScreen } from '@/screens/TaskFormScreen';
import NutritionServiceScreen from '@/screens/NutritionServiceScreen';
import NutritionistDetailScreen from '@/screens/NutritionistDetailScreen';
import WellnessGuideScreen from '@/screens/WellnessGuideScreen';
import VIPServiceDeskScreen from '@/screens/VIPServiceDeskScreen';
import VIPServiceIntroScreen from '@/screens/VIPServiceIntroScreen';
import CheckoutScreen from '@/screens/CheckoutScreen';
import PaymentScreen from '@/screens/PaymentScreen';
import OrderListScreen from '@/screens/OrderListScreen';
import OrderDetailScreen from '@/screens/OrderDetailScreen';
import { DeliveryServiceScreen } from '@/screens/DeliveryServiceScreen';
import { ProductDetailScreen } from '@/screens/ProductDetailScreen';
import GroceryCheckoutScreen from '@/screens/GroceryCheckoutScreen';
import ElderlyServiceScreen from '@/screens/ElderlyServiceScreen';
import CaregiverDetailScreen from '@/screens/CaregiverDetailScreen';
import { ArticleDetailScreen } from '@/screens/ArticleDetailScreen';
import { ArticleListScreen } from '@/screens/ArticleListScreen';
import { CircleDetailScreen } from '@/screens/CircleDetailScreen';
import { CircleListScreen } from '@/screens/CircleListScreen';
import { VideoListScreen } from '@/screens/VideoListScreen';
import { VideoDetailScreen } from '@/screens/VideoDetailScreen';
import { TopicDetailScreen } from '@/screens/TopicDetailScreen';
import { JobListScreen } from '@/screens/JobListScreen';
import { JobDetailScreen } from '@/screens/JobDetailScreen';
import { JobPublishScreen } from '@/screens/JobPublishScreen';
import { MyJobsScreen } from '@/screens/MyJobsScreen';
import { SecondHandDetailScreen } from '@/screens/SecondHandDetailScreen';
import { SecondHandListScreen } from '@/screens/SecondHandListScreen';
import { SecondHandPublishScreen } from '@/screens/SecondHandPublishScreen';
import { MySecondHandScreen } from '@/screens/MySecondHandScreen';
import { ExpertDetailScreen } from '@/screens/ExpertDetailScreen';
import { ExpertListScreen } from '@/screens/ExpertListScreen';
import { ExpertDashboardScreen } from '@/screens/ExpertDashboardScreen';
import { PostDetailScreen } from '@/screens/PostDetailScreen';
import { PostPublishScreen } from '@/screens/PostPublishScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { ChatListScreen } from '@/screens/ChatListScreen';
import { ServiceOrderDetailScreen } from '@/screens/ServiceOrderDetailScreen';
import { ServiceReviewScreen } from '@/screens/ServiceReviewScreen';
import { MyOrdersScreen } from '@/screens/MyOrdersScreen';
import { ExpertCertificationScreen } from '@/screens/ExpertCertificationScreen';
import { ExpertTermsScreen } from '@/screens/ExpertTermsScreen';
import { ExpertTerminateScreen } from '@/screens/ExpertTerminateScreen';
import { ExpertOrdersScreen } from '@/screens/ExpertOrdersScreen';
import { ServiceBookingScreen } from '@/screens/ServiceBookingScreen';
import { PrivateDoctorListScreen } from '@/screens/PrivateDoctorListScreen';
import { PrivateDoctorDetailScreen } from '@/screens/PrivateDoctorDetailScreen';
import { PrivateDoctorSubscribeScreen } from '@/screens/PrivateDoctorSubscribeScreen';
import { SubscriptionSuccessScreen } from '@/screens/SubscriptionSuccessScreen';
import { PrivateDoctorServiceDeskScreen } from '@/screens/PrivateDoctorServiceDeskScreen';
import { ConsultationListScreen } from '@/screens/ConsultationListScreen';
import DoctorChatScreen from '@/screens/DoctorChatScreen';
import BookConsultationScreen from '@/screens/BookConsultationScreen';
import ConsultationDetailScreen from '@/screens/ConsultationDetailScreen';
import HealthRecordsScreen from '@/screens/HealthRecordsScreen';
import HealthAssessmentScreen from '@/screens/HealthAssessmentScreen';
import HealthPlanScreen from '@/screens/HealthPlanScreen';
import HealthManagerScreen from '@/screens/HealthManagerScreen';
import ExpertConsultationScreen from '@/screens/ExpertConsultationScreen';
import InternationalReferralScreen from '@/screens/InternationalReferralScreen';
import ContractManagementScreen from '@/screens/ContractManagementScreen';
import LegalServiceHomeScreen from '@/screens/LegalServiceHomeScreen';
import WillCreatorScreen from '@/screens/WillCreatorScreen';
import WillReviewScreen from '@/screens/WillReviewScreen';
import WillExecutionGuideScreen from '@/screens/WillExecutionGuideScreen';
import MyWillsScreen from '@/screens/MyWillsScreen';
import GuardianshipCreatorScreen from '@/screens/GuardianshipCreatorScreen';
import MyGuardianshipScreen from '@/screens/MyGuardianshipScreen';
import PropertyInventoryScreen from '@/screens/PropertyInventoryScreen';
import LawyerListScreen from '@/screens/LawyerListScreen';
import LawyerDetailScreen from '@/screens/LawyerDetailScreen';
import TextConsultationScreen from '@/screens/TextConsultationScreen';
import PhoneConsultationScreen from '@/screens/PhoneConsultationScreen';
import VideoConsultationScreen from '@/screens/VideoConsultationScreen';
import ConsultationHistoryScreen from '@/screens/ConsultationHistoryScreen';
import MyCasesScreen from '@/screens/MyCasesScreen';
import CaseDelegationScreen from '@/screens/CaseDelegationScreen';
import CaseLibraryScreen from '@/screens/CaseLibraryScreen';
import ContractReviewScreen from '@/screens/ContractReviewScreen';
import LegalCheckupScreen from '@/screens/LegalCheckupScreen';
import LegalVideoScreen from '@/screens/LegalVideoScreen';
import LegalArticleScreen from '@/screens/LegalArticleScreen';
import DocumentTemplateScreen from '@/screens/DocumentTemplateScreen';
import LegalMembershipScreen from '@/screens/LegalMembershipScreen';
import InsuranceHomeScreen from '@/screens/InsuranceHomeScreen';
import InsuranceProductListScreen from '@/screens/InsuranceProductListScreen';
import InsuranceProductDetailScreen from '@/screens/InsuranceProductDetailScreen';
import ProductComparisonScreen from '@/screens/ProductComparisonScreen';
import InsuranceAdvisorListScreen from '@/screens/InsuranceAdvisorListScreen';
import InsuranceAdvisorDetailScreen from '@/screens/InsuranceAdvisorDetailScreen';
import InsuranceTextConsultationScreen from '@/screens/InsuranceTextConsultationScreen';
import InsurancePhoneConsultationScreen from '@/screens/InsurancePhoneConsultationScreen';
import InsuranceVideoConsultationScreen from '@/screens/InsuranceVideoConsultationScreen';
import InsuranceHomeVisitScreen from '@/screens/InsuranceHomeVisitScreen';
import InsuranceConsultationHistoryScreen from '@/screens/InsuranceConsultationHistoryScreen';
import AIPlannerWizardScreen from '@/screens/AIPlannerWizardScreen';
import InsurancePlanResultScreen from '@/screens/InsurancePlanResultScreen';
import SmartUnderwritingScreen from '@/screens/SmartUnderwritingScreen';
import CoverageGapAnalysisScreen from '@/screens/CoverageGapAnalysisScreen';
import MyInsurancePoliciesScreen from '@/screens/MyInsurancePoliciesScreen';
import InsurancePolicyDetailScreen from '@/screens/InsurancePolicyDetailScreen';
import ClaimAssistanceScreen from '@/screens/ClaimAssistanceScreen';
import ClaimHistoryScreen from '@/screens/ClaimHistoryScreen';
import InsuranceCompanyListScreen from '@/screens/InsuranceCompanyListScreen';
import InsuranceArticleScreen from '@/screens/InsuranceArticleScreen';
import InsuranceVideoScreen from '@/screens/InsuranceVideoScreen';
import ClaimCaseLibraryScreen from '@/screens/ClaimCaseLibraryScreen';
import InsuranceCalculatorScreen from '@/screens/InsuranceCalculatorScreen';
import InsuranceQAScreen from '@/screens/InsuranceQAScreen';
import InsuranceSpecialTopicScreen from '@/screens/InsuranceSpecialTopicScreen';
import MembershipCenterScreen from '@/screens/MembershipCenterScreen';
import CustomerServiceChatScreen from '@/screens/CustomerServiceChatScreen';
import AddFamilyMemberScreen from '@/screens/AddFamilyMemberScreen';
import ProfileEditScreen from '@/screens/ProfileEditScreen';
import { ColumnListScreen } from '@/screens/ColumnListScreen';
import { ContentDetailScreen } from '@/screens/ContentDetailScreen';
import RankingDetailScreen from '@/screens/RankingDetailScreen';
import { ExpertChatScreen } from '@/screens/ExpertChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab导航器组件 - 包含4个主页面
const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // 主题色值
  const primaryColor = theme.primary?.val || '#6366F1';
  const textSecondaryColor = theme.color10?.val || '#6B7280';
  const backgroundColor = theme.color2?.val || '#FAFCFF';

  return (
    <Tab.Navigator
      initialRouteName={SCREEN_NAMES.HEALTH_TAB}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let IconComponent = Heart;

          if (route.name === SCREEN_NAMES.HEALTH_TAB) {
            IconComponent = Heart;
          } else if (route.name === SCREEN_NAMES.LIFESTYLE_TAB) {
            IconComponent = Activity;
          } else if (route.name === SCREEN_NAMES.COMMUNITY_TAB) {
            IconComponent = Users;
          } else if (route.name === SCREEN_NAMES.PROFILE_TAB) {
            IconComponent = User;
          }

          return (
            <View>
              <IconComponent
                size={size}
                color={focused ? primaryColor : textSecondaryColor}
              />
            </View>
          );
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: textSecondaryColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: theme.color5?.val || '#E2E6EC',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          shadowColor: primaryColor,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={SCREEN_NAMES.HEALTH_TAB}
        component={HealthScreen}
        options={{ title: '康' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.LIFESTYLE_TAB}
        component={WellnessScreen}
        options={{ title: '养' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.COMMUNITY_TAB}
        component={CommunityScreen}
        options={{ title: '社区' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.PROFILE_TAB}
        component={PersonalCenterScreen}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
};

// 主导航器 - Stack Navigator作为根，Tab作为第一个screen，全屏页面作为其他screens
export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 全部隐藏默认header
      }}
    >
      {/* Tab导航器作为首页 - 显示底部导航栏 */}
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
      />

      {/* 全屏页面 - 不显示底部导航栏 */}
      <Stack.Screen
        name="AIConsultation"
        component={AIConsultationScreen}
      />
      <Stack.Screen
        name="HealthReport"
        component={HealthReportScreen}
      />
      <Stack.Screen
        name="DeviceManagement"
        component={DeviceManagementScreen}
      />
      <Stack.Screen
        name="DataConfirmation"
        component={DataConfirmationScreen}
      />
      <Stack.Screen
        name="MedicationReminder"
        component={MedicationReminderScreen}
      />
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
      />
      <Stack.Screen
        name="TaskForm"
        component={TaskFormScreen}
      />
      <Stack.Screen
        name="NutritionService"
        component={NutritionServiceScreen}
      />
      <Stack.Screen
        name="WellnessGuide"
        component={WellnessGuideScreen}
      />
      <Stack.Screen
        name="VIPServiceDesk"
        component={VIPServiceDeskScreen}
      />
      <Stack.Screen
        name="VIPServiceIntro"
        component={VIPServiceIntroScreen}
      />
      <Stack.Screen
        name="NutritionistDetail"
        component={NutritionistDetailScreen}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderListScreen}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
      />
      <Stack.Screen
        name="ServiceOrderDetail"
        component={ServiceOrderDetailScreen}
      />
      <Stack.Screen
        name="ServiceReview"
        component={ServiceReviewScreen}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
      />
      <Stack.Screen
        name="DeliveryService"
        component={DeliveryServiceScreen}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
      <Stack.Screen
        name="GroceryCheckout"
        component={GroceryCheckoutScreen}
      />
      <Stack.Screen
        name="ElderlyService"
        component={ElderlyServiceScreen}
      />
      <Stack.Screen
        name="CaregiverDetail"
        component={CaregiverDetailScreen}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
      />
      <Stack.Screen
        name="ArticleList"
        component={ArticleListScreen}
      />
      <Stack.Screen
        name="CircleDetail"
        component={CircleDetailScreen}
      />
      <Stack.Screen
        name="CircleList"
        component={CircleListScreen}
      />
      <Stack.Screen
        name="VideoList"
        component={VideoListScreen}
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
      />
      <Stack.Screen
        name="TopicDetail"
        component={TopicDetailScreen}
      />
      <Stack.Screen
        name="JobList"
        component={JobListScreen}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
      />
      <Stack.Screen
        name="JobPublish"
        component={JobPublishScreen}
      />
      <Stack.Screen
        name="MyJobs"
        component={MyJobsScreen}
      />
      <Stack.Screen
        name="SecondHandDetail"
        component={SecondHandDetailScreen}
      />
      <Stack.Screen
        name="SecondHandList"
        component={SecondHandListScreen}
      />
      <Stack.Screen
        name="SecondHandPublish"
        component={SecondHandPublishScreen}
      />
      <Stack.Screen
        name="MySecondHand"
        component={MySecondHandScreen}
      />
      <Stack.Screen
        name="ExpertDetail"
        component={ExpertDetailScreen}
      />
      <Stack.Screen
        name="ExpertList"
        component={ExpertListScreen}
      />
      <Stack.Screen
        name="ExpertDashboard"
        component={ExpertDashboardScreen}
      />
      <Stack.Screen
        name="ExpertCertification"
        component={ExpertCertificationScreen}
      />
      <Stack.Screen
        name="ExpertTerms"
        component={ExpertTermsScreen}
      />
      <Stack.Screen
        name="ExpertTerminate"
        component={ExpertTerminateScreen}
      />
      <Stack.Screen
        name="ExpertOrders"
        component={ExpertOrdersScreen}
      />
      <Stack.Screen
        name="ServiceBooking"
        component={ServiceBookingScreen}
      />
      <Stack.Screen
        name="ExpertChat"
        component={ExpertChatScreen}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
      />
      <Stack.Screen
        name="PostPublish"
        component={PostPublishScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
      />

      {/* 私人医生服务 */}
      <Stack.Screen
        name="PrivateDoctorList"
        component={PrivateDoctorListScreen}
      />
      <Stack.Screen
        name="PrivateDoctorDetail"
        component={PrivateDoctorDetailScreen}
      />
      <Stack.Screen
        name="PrivateDoctorSubscribe"
        component={PrivateDoctorSubscribeScreen}
      />
      <Stack.Screen
        name="SubscriptionSuccess"
        component={SubscriptionSuccessScreen}
      />
      <Stack.Screen
        name="PrivateDoctorServiceDesk"
        component={PrivateDoctorServiceDeskScreen}
      />
      <Stack.Screen
        name="ConsultationList"
        component={ConsultationListScreen}
      />
      <Stack.Screen
        name="DoctorChat"
        component={DoctorChatScreen}
      />
      <Stack.Screen
        name="BookConsultation"
        component={BookConsultationScreen}
      />
      <Stack.Screen
        name="ConsultationDetail"
        component={ConsultationDetailScreen}
      />
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordsScreen}
      />
      <Stack.Screen
        name="HealthAssessment"
        component={HealthAssessmentScreen}
      />
      <Stack.Screen
        name="HealthPlan"
        component={HealthPlanScreen}
      />
      <Stack.Screen
        name="HealthManager"
        component={HealthManagerScreen}
      />
      <Stack.Screen
        name="ExpertConsultation"
        component={ExpertConsultationScreen}
      />
      <Stack.Screen
        name="InternationalReferral"
        component={InternationalReferralScreen}
      />
      <Stack.Screen
        name="ContractManagement"
        component={ContractManagementScreen}
      />

      {/* 法律服务 - Legal Services */}
      <Stack.Screen
        name="LegalServiceHome"
        component={LegalServiceHomeScreen}
      />
      <Stack.Screen
        name="WillCreator"
        component={WillCreatorScreen}
      />
      <Stack.Screen
        name="WillReview"
        component={WillReviewScreen}
      />
      <Stack.Screen
        name="WillExecutionGuide"
        component={WillExecutionGuideScreen}
      />
      <Stack.Screen
        name="MyWills"
        component={MyWillsScreen}
      />
      <Stack.Screen
        name="GuardianshipCreator"
        component={GuardianshipCreatorScreen}
      />
      <Stack.Screen
        name="MyGuardianship"
        component={MyGuardianshipScreen}
      />
      <Stack.Screen
        name="PropertyInventory"
        component={PropertyInventoryScreen}
      />
      <Stack.Screen
        name="LawyerList"
        component={LawyerListScreen}
      />
      <Stack.Screen
        name="LawyerDetail"
        component={LawyerDetailScreen}
      />
      <Stack.Screen
        name="TextConsultation"
        component={TextConsultationScreen}
      />
      <Stack.Screen
        name="PhoneConsultation"
        component={PhoneConsultationScreen}
      />
      <Stack.Screen
        name="VideoConsultation"
        component={VideoConsultationScreen}
      />
      <Stack.Screen
        name="ConsultationHistory"
        component={ConsultationHistoryScreen}
      />
      <Stack.Screen
        name="MyCases"
        component={MyCasesScreen}
      />
      <Stack.Screen
        name="CaseDelegation"
        component={CaseDelegationScreen}
      />
      <Stack.Screen
        name="CaseLibrary"
        component={CaseLibraryScreen}
      />
      <Stack.Screen
        name="ContractReview"
        component={ContractReviewScreen}
      />
      <Stack.Screen
        name="LegalCheckup"
        component={LegalCheckupScreen}
      />
      <Stack.Screen
        name="LegalVideo"
        component={LegalVideoScreen}
      />
      <Stack.Screen
        name="LegalArticle"
        component={LegalArticleScreen}
      />
      <Stack.Screen
        name="DocumentTemplate"
        component={DocumentTemplateScreen}
      />
      <Stack.Screen
        name="LegalMembership"
        component={LegalMembershipScreen}
      />

      {/* 保险规划 - Insurance Planning */}
      <Stack.Screen
        name="InsuranceHome"
        component={InsuranceHomeScreen}
      />
      <Stack.Screen
        name="InsuranceProductList"
        component={InsuranceProductListScreen}
      />
      <Stack.Screen
        name="InsuranceProductDetail"
        component={InsuranceProductDetailScreen}
      />
      <Stack.Screen
        name="ProductComparison"
        component={ProductComparisonScreen}
      />
      <Stack.Screen
        name="InsuranceAdvisorList"
        component={InsuranceAdvisorListScreen}
      />
      <Stack.Screen
        name="InsuranceAdvisorDetail"
        component={InsuranceAdvisorDetailScreen}
      />
      <Stack.Screen
        name="InsuranceTextConsultation"
        component={InsuranceTextConsultationScreen}
      />
      <Stack.Screen
        name="InsurancePhoneConsultation"
        component={InsurancePhoneConsultationScreen}
      />
      <Stack.Screen
        name="InsuranceVideoConsultation"
        component={InsuranceVideoConsultationScreen}
      />
      <Stack.Screen
        name="InsuranceHomeVisit"
        component={InsuranceHomeVisitScreen}
      />
      <Stack.Screen
        name="InsuranceConsultationHistory"
        component={InsuranceConsultationHistoryScreen}
      />
      <Stack.Screen
        name="AIPlannerWizard"
        component={AIPlannerWizardScreen}
      />
      <Stack.Screen
        name="InsurancePlanResult"
        component={InsurancePlanResultScreen}
      />
      <Stack.Screen
        name="SmartUnderwriting"
        component={SmartUnderwritingScreen}
      />
      <Stack.Screen
        name="CoverageGapAnalysis"
        component={CoverageGapAnalysisScreen}
      />
      <Stack.Screen
        name="MyInsurancePolicies"
        component={MyInsurancePoliciesScreen}
      />
      <Stack.Screen
        name="InsurancePolicyDetail"
        component={InsurancePolicyDetailScreen}
      />
      <Stack.Screen
        name="ClaimAssistance"
        component={ClaimAssistanceScreen}
      />
      <Stack.Screen
        name="ClaimHistory"
        component={ClaimHistoryScreen}
      />
      <Stack.Screen
        name="InsuranceCompanyList"
        component={InsuranceCompanyListScreen}
      />
      <Stack.Screen
        name="InsuranceArticle"
        component={InsuranceArticleScreen}
      />
      <Stack.Screen
        name="InsuranceVideo"
        component={InsuranceVideoScreen}
      />
      <Stack.Screen
        name="ClaimCaseLibrary"
        component={ClaimCaseLibraryScreen}
      />
      <Stack.Screen
        name="InsuranceCalculator"
        component={InsuranceCalculatorScreen}
      />
      <Stack.Screen
        name="InsuranceQA"
        component={InsuranceQAScreen}
      />
      <Stack.Screen
        name="InsuranceSpecialTopic"
        component={InsuranceSpecialTopicScreen}
      />

      {/* 会员中心 - Membership Center */}
      <Stack.Screen
        name="MembershipCenter"
        component={MembershipCenterScreen}
      />

      {/* 客服聊天 - Customer Service Chat */}
      <Stack.Screen
        name="CustomerServiceChat"
        component={CustomerServiceChatScreen}
      />

      {/* 添加家庭成员 - Add Family Member */}
      <Stack.Screen
        name="AddFamilyMember"
        component={AddFamilyMemberScreen}
      />

      {/* 编辑个人信息 - Profile Edit */}
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
      />

      {/* 栏目系统 - Column System */}
      <Stack.Screen
        name="ColumnList"
        component={ColumnListScreen}
      />
      <Stack.Screen
        name="ContentDetail"
        component={ContentDetailScreen}
      />

      {/* 榜单详情 - Ranking Detail */}
      <Stack.Screen
        name="RankingDetail"
        component={RankingDetailScreen}
      />
    </Stack.Navigator>
  );
};