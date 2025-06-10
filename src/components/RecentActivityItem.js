import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Chip } from 'react-native-paper';

const RecentActivityItem = ({ icon, title, date, points, status }) => (
  <View style={styles.container}>
    <Avatar.Icon icon={icon} size={40} style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{`${date} • ${points} pontos`}</Text>
    </View>
    <Chip 
      style={[styles.chip, status === 'ativa' ? styles.chipActive : styles.chipClosed]}
      textStyle={[styles.chipText, status === 'ativa' ? styles.chipTextActive : styles.chipTextClosed]}
    >
      {status}
    </Chip>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingHorizontal: 16
  },
  icon: {
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  chip: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#E6F3EE', 
  },
  chipClosed: {
    backgroundColor: '#EEEEEE', 
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chipTextActive: {
    color: '#3D8B6D', 
  },
  chipTextClosed: {
    color: '#666', 
  },
});

export default RecentActivityItem;