import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SectionList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const RecentActivities = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedFilter, setSelectedFilter] = useState('all');

  const colors = {
    primary: '#4361ee',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  // Sample data - replace with real data
  const allActivities = [
    { 
      date: '2023-08-20',
      data: [
        { id: '1', title: 'Mathematics Quiz', duration: '45 mins', type: 'Mathematics' },
        { id: '2', title: 'Physics Chapter 2', duration: '1h 30m', type: 'Physics' },
      ]
    },
    { 
      date: '2023-08-19',
      data: [
        { id: '3', title: 'Chemistry Test', duration: '30 mins', type: 'Chemistry' },
        { id: '4', title: 'Biology Test', duration: '30 mins', type: 'Biology' },
      ]
    },
    { 
      date: '2023-08-18',
      data: [
        { id: '5', title: 'Algebra Basics', duration: '45 mins', type: 'Mathematics' },
        { id: '6', title: 'Organic Chemistry', duration: '1h 15m', type: 'Chemistry' },
      ]
    },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'Mathematics', label: 'Math' },
    { id: 'Physics', label: 'Physics' },
    { id: 'Chemistry', label: 'Chemistry' },
    { id: 'Biology', label: 'Biology' },
  ];

  const filteredActivities = allActivities
    .map(section => ({
      ...section,
      data: section.data.filter(activity => 
        selectedFilter === 'all' || activity.type === selectedFilter
      )
    }))
    .filter(section => section.data.length > 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/inside/activity/[id]',
        params: { ...item }
      })}
    >
      <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
        <View style={styles.activityContent}>
          <Text style={[styles.activityTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={{ color: colors.secondaryText }}>{item.duration}</Text>
        </View>
        <View style={styles.activityType}>
          <Ionicons 
            name="book" 
            size={16} 
            color={colors.primary} 
            style={styles.typeIcon} 
          />
          <Text style={[styles.typeText, { color: colors.primary }]}>
            {item.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Recent Activities</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Filter Bar */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={[
              styles.filterButton,
              { 
                backgroundColor: filter.id === selectedFilter ? colors.primary : colors.cardBackground,
                borderColor: colors.border
              }
            ]}
          >
            <Text style={[
              styles.filterText,
              { color: filter.id === selectedFilter ? colors.cardBackground : colors.text }
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activities List */}
      <SectionList
        sections={filteredActivities}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { date } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[styles.sectionDate, { color: colors.secondaryText }]}>
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar" size={48} color={colors.secondaryText} />
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              No activities found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500'
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80
  },
  sectionHeader: {
    paddingVertical: 8,
    marginTop: 16
  },
  sectionDate: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    borderBottomWidth: 1
  },
  activityContent: {
    marginBottom: 8
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  activityType: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  typeIcon: {
    marginRight: 4
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16
  }
};

export default RecentActivities;