#!/bin/bash

# List of widget processes to stop
widget_names=(
  "StocksWidget"
  "WeatherWidget"
  "FindMyWidgetItems"
  "WorldClockWidget"
  "macOSWidgetExtension"
  "CalendarWidgetExtension"
  "PhotosReliveWidget"
  "TipsWidgetExtension"
  "BatteriesAvocadoWidgetExtension"
  "ScreenTimeWidgetExtension"
  "FindMyWidgetPeople"
  "HomeEnergyWidgetsExtension"
  "HomeWidget"
  "PodcastsWidget"
  "SafariWidgetExtension"
  "PeopleWidget"
  "macOSExtension"
  "com.apple.Notes.WidgetExtension"
  "ShortcutsWidgetExtension"
)

# Loop through the widget names and kill each process
for widget in "${widget_names[@]}"; do
  echo "Stopping process: $widget"
  pkill -f "$widget"  # Use pkill to terminate processes by name
done

echo "All specified widget processes have been stopped."
